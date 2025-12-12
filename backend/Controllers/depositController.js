
const DepositRequest = require('../Models/DepositRequest');
const User = require('../Models/User');

exports.createDepositRequest = async (req, res) => {
    try {
        const userId = req.user.id;
        const { amount, transactionId } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid amount"
            });
        }

        if (!transactionId) {
            return res.status(400).json({
                success: false,
                message: "Transaction ID is required"
            });
        }

        const depositRequest = await DepositRequest.create({
            user: userId,
            amount: Number(amount),
            transactionId
        });

        res.status(200).json({
            success: true,
            message: "Deposit request submitted successfully",
            depositRequest
        });
    } catch (error) {
        console.error("Error creating deposit request:", error);
        res.status(500).json({
            success: false,
            message: "Error submitting deposit request",
            error: error.message
        });
    }
};

exports.getAllDepositRequests = async (req, res) => {
    try {
        const requests = await DepositRequest.find()
            .populate('user', 'name email userId referredBy')
            .sort({ requestDate: -1 });

        res.status(200).json({
            success: true,
            requests
        });
    } catch (error) {
        console.error("Error fetching deposit requests:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching deposit requests",
            error: error.message
        });
    }
};

exports.processDepositRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { status } = req.body;

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status"
            });
        }

        const depositRequest = await DepositRequest.findById(requestId).populate('user');
        if (!depositRequest) {
            return res.status(404).json({
                success: false,
                message: "Deposit request not found"
            });
        }

        if (depositRequest.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: "Request already processed"
            });
        }

        if (status === 'approved') {
            const user = depositRequest.user;
            const amount = depositRequest.amount;

            // 1. Add balance to user
            await User.findByIdAndUpdate(user._id, {
                $inc: { tokenBalance: amount }
            });

            // 2. Process referral bonus (10%)
            if (user.referredBy) {
                const referrer = await User.findOne({ userId: user.referredBy });
                if (referrer) {
                    const bonusAmount = amount * 0.10;
                    await User.findByIdAndUpdate(referrer._id, {
                        $inc: { tokenBalance: bonusAmount }
                    });
                    console.log(`Referral bonus of ${bonusAmount} added to ${referrer.email}`);
                }
            }
        }

        depositRequest.status = status;
        depositRequest.processedDate = new Date();
        await depositRequest.save();

        res.status(200).json({
            success: true,
            message: `Deposit request ${status} successfully`
        });

    } catch (error) {
        console.error("Error processing deposit request:", error);
        res.status(500).json({
            success: false,
            message: "Error processing deposit request",
            error: error.message
        });
    }
};
