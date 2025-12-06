


// //MiningController.js
const User = require('../Models/User');
const WithdrawalRequest = require('../Models/WithdrawalRequest');

exports.mineTokens = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Check if 1 minute has passed since last mining
        const currentTime = new Date();
        if (user.lastMiningTimestamp) {
            const timeDifference = currentTime - user.lastMiningTimestamp;
            // const minutesDifference = timeDifference / (1000 * 60); 
            const hoursDifference = timeDifference / (1000 * 60 * 60); // Convert to hours

            // if (minutesDifference < 1) {
            //     const secondsRemaining = Math.ceil((60 - (timeDifference / 1000)));
            //     return res.status(400).json({
            //         success: false,
            //         message: `Mining not available. Please wait ${secondsRemaining} seconds.`
            //     });
            // }

            if (hoursDifference < 24) {
                const hoursRemaining = Math.floor(24 - hoursDifference);
                const minutesRemaining = Math.floor((24 - hoursDifference - hoursRemaining) * 60);
                return res.status(400).json({
                    success: false,
                    message: `Mining not available. Please wait ${hoursRemaining} hours and ${minutesRemaining} minutes.`
                });
            }
        }

        // Get pending withdrawal amount
        const pendingWithdrawal = await WithdrawalRequest.findOne({
            user: userId,
            status: 'pending'
        });

        const pendingAmount = pendingWithdrawal ? pendingWithdrawal.amount : 0;
        const miningBalance = Math.max(0, user.tokenBalance - pendingAmount);

        // Calculate 1% increase based on mining balance
        const increase = miningBalance * 0.01;
        const newBalance = user.tokenBalance + increase;

        // Update user's token balance and mining timestamp
        user.tokenBalance = newBalance;
        user.lastMiningTimestamp = currentTime;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Mining successful",
            data: {
                previousBalance: user.tokenBalance,
                miningBalance: miningBalance,
                pendingWithdrawal: pendingAmount,
                increase: increase,
                newBalance: newBalance,
                // nextMiningAvailable: new Date(currentTime.getTime() + 60 * 1000) 
                nextMiningAvailable: new Date(currentTime.getTime() + 24 * 60 * 60 * 1000) // 24 hours in milliseconds
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error during mining operation"
        });
    }
};

exports.getTokenBalance = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select('tokenBalance lastMiningTimestamp');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Get pending withdrawal amount
        const pendingWithdrawal = await WithdrawalRequest.findOne({
            user: userId,
            status: 'pending'
        });

        const pendingAmount = pendingWithdrawal ? pendingWithdrawal.amount : 0;
        const miningBalance = Math.max(0, user.tokenBalance - pendingAmount);

        let nextMiningAvailable = null;
        if (user.lastMiningTimestamp) {
            // nextMiningAvailable = new Date(user.lastMiningTimestamp.getTime() + 60 * 1000);
            nextMiningAvailable = new Date(user.lastMiningTimestamp.getTime() + 24 * 60 * 60 * 1000);
        }

        return res.status(200).json({
            success: true,
            data: {
                tokenBalance: user.tokenBalance,
                miningBalance: miningBalance,
                pendingWithdrawal: pendingAmount,
                lastMiningTimestamp: user.lastMiningTimestamp,
                nextMiningAvailable: nextMiningAvailable
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error fetching token balance"
        });
    }
};