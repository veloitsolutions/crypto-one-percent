


// Controllers/withdrawalController.js
const WithdrawalRequest = require('../Models/WithdrawalRequest');
const User = require('../Models/User');

exports.getAllWithdrawalRequests = async (req, res) => {
    try {
        const withdrawalRequests = await WithdrawalRequest.find()
            .populate('user', 'name email phone')
            .sort({ requestDate: -1 });

        res.status(200).json({
            success: true,
            requests: withdrawalRequests
        });
    } catch (error) {
        console.error("Error in getAllWithdrawalRequests:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching withdrawal requests",
            error: error.message
        });
    }
};

exports.createWithdrawalRequest = async (req, res) => {
    try {
        const userId = req.user.id;
        const { amount, link } = req.body;

        // Validate link
        if (!link || link.trim() === '') {
            return res.status(400).json({
                success: false,
                message: "Link is required"
            });
        }

        const user = await User.findById(userId);
        
        // Check if user has enough balance
        if (user.tokenBalance < amount) {
            return res.status(400).json({
                success: false,
                message: "Insufficient token balance"
            });
        }

        // Check if user has active withdrawal request
        if (user.hasActiveWithdrawal) {
            return res.status(400).json({
                success: false,
                message: "You already have a pending withdrawal request"
            });
        }

        // Check if user is currently mining
        const currentTime = new Date();
        if (user.lastMiningTimestamp) {
            const timeDifference = currentTime - user.lastMiningTimestamp;
            if (timeDifference < 60000) { // 60000ms = 1 minute
                return res.status(400).json({
                    success: false,
                    message: "Cannot withdraw during mining period"
                });
            }
        }

        // Create withdrawal request
        const withdrawalRequest = new WithdrawalRequest({
            user: userId,
            amount: amount,
            link: link.trim()
        });

        await withdrawalRequest.save();

        // Update user's hasActiveWithdrawal status
        user.hasActiveWithdrawal = true;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Withdrawal request created successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating withdrawal request",
            error: error.message
        });
    }
};

exports.processWithdrawalRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { status } = req.body;

        // Validate status
        if (!status || !['approved', 'rejected'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status. Must be either 'approved' or 'rejected'"
            });
        }

        const withdrawalRequest = await WithdrawalRequest.findById(requestId);
        if (!withdrawalRequest) {
            return res.status(404).json({
                success: false,
                message: "Withdrawal request not found"
            });
        }

        // Check if request is already processed
        if (withdrawalRequest.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: `Withdrawal request is already ${withdrawalRequest.status}`
            });
        }

        const user = await User.findById(withdrawalRequest.user);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        withdrawalRequest.status = status;
        withdrawalRequest.processedDate = new Date();

        if (status === 'approved') {
            // Verify user still has sufficient balance
            if (user.tokenBalance < withdrawalRequest.amount) {
                return res.status(400).json({
                    success: false,
                    message: "User no longer has sufficient balance"
                });
            }
            // Deduct tokens from user's balance
            user.tokenBalance -= withdrawalRequest.amount;
        }

        // Reset user's withdrawal request status
        user.hasActiveWithdrawal = false;

        await Promise.all([
            withdrawalRequest.save(),
            user.save()
        ]);

        res.status(200).json({
            success: true,
            message: `Withdrawal request ${status} successfully`,
            data: {
                requestStatus: status,
                newBalance: user.tokenBalance,
                withdrawalAmount: withdrawalRequest.amount,
                withdrawalLink: withdrawalRequest.link,
                processedDate: withdrawalRequest.processedDate
            }
        });
    } catch (error) {
        console.error("Error in processWithdrawalRequest:", error);
        res.status(500).json({
            success: false,
            message: "Error processing withdrawal request",
            error: error.message
        });
    }
};