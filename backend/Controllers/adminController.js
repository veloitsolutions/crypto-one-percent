

// // Controllers/adminController.js
const ReferralReward = require("../Models/ReferralReward");
const User = require("../Models/User");


exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: "Investor" })
            .select("-password")
            .select("-__v");

        res.status(200).json({
            success: true,
            users
        });
    } catch (error) {
        console.error("Error in getAllUsers:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

exports.getUserDetails = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId)
            .select("-password")
            .select("-__v");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error("Error in getUserDetails:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

exports.editUserDetails = async (req, res) => {
    try {
        const { userId } = req.params;
        const { tokenBalance } = req.body;

        // Validate tokenBalance
        if (typeof tokenBalance !== 'number' || tokenBalance < 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid token balance value"
            });
        }

        // Find and update only the token balance
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: { tokenBalance } },
            { new: true, runValidators: true }
        ).select("-password -__v");

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Token balance updated successfully",
            user: updatedUser
        });
    } catch (error) {
        console.error("Error in editUserDetails:", error);
        res.status(500).json({
            success: false,
            message: "Error updating token balance",
            error: error.message
        });
    }
};

exports.getPendingReferralRewards = async (req, res) => {
    try {
        const rewards = await ReferralReward.find({ status: 'pending' });
        res.status(200).json({
            success: true,
            rewards
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching referral rewards",
            error: error.message
        });
    }
};

exports.approveReferralReward = async (req, res) => {
    try {
        const { rewardId } = req.params;

        const reward = await ReferralReward.findById(rewardId);
        if (!reward || reward.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: "Invalid reward or already processed"
            });
        }

        // Update reward status
        reward.status = 'approved';
        await reward.save();

        // Add tokens to referrer's balance
        await User.findOneAndUpdate(
            { userId: reward.referrer },
            {
                $inc: { tokenBalance: reward.amount },
                $pull: { pendingReferralRewards: rewardId }
            }
        );

        res.status(200).json({
            success: true,
            message: "Referral reward approved successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error approving referral reward",
            error: error.message
        });
    }
};

exports.rejectReferralReward = async (req, res) => {
    try {
        const { rewardId } = req.params;

        const reward = await ReferralReward.findById(rewardId);
        if (!reward || reward.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: "Invalid reward or already processed"
            });
        }

        // Update reward status to rejected
        reward.status = 'rejected';
        await reward.save();

        // Remove from user's pending rewards without adding any tokens
        await User.findOneAndUpdate(
            { userId: reward.referrer },
            { $pull: { pendingReferralRewards: rewardId } }
        );

        res.status(200).json({
            success: true,
            message: "Referral reward rejected successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error rejecting referral reward",
            error: error.message
        });
    }
};

exports.addTokenBalance = async (req, res) => {
    try {
        const { userId } = req.params;
        const { amount } = req.body;

        if (typeof amount !== 'number' || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid amount. Must be a positive number."
            });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { $inc: { tokenBalance: amount } },
            { new: true }
        ).select("-password -__v");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Balance added successfully",
            user
        });
    } catch (error) {
        console.error("Error in addTokenBalance:", error);
        res.status(500).json({
            success: false,
            message: "Error adding balance",
            error: error.message
        });
    }
};

