


// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const { auth, isAdmin } = require("../Middlewares/authMiddleware");
const { getAllUsers, getUserDetails, editUserDetails, getPendingReferralRewards, approveReferralReward, rejectReferralReward } = require("../Controllers/adminController");

// Admin routes
router.get("/users", auth, isAdmin, getAllUsers);
router.get("/users/:userId", auth, isAdmin, getUserDetails);

router.put("/users/:userId", auth, isAdmin, editUserDetails);
module.exports = router;

router.get("/referral-rewards", auth, isAdmin, getPendingReferralRewards);
router.post("/referral-rewards/:rewardId/approve", auth, isAdmin, approveReferralReward);
router.post("/referral-rewards/:rewardId/reject", auth, isAdmin, rejectReferralReward);
