

const express = require("express");
const router = express.Router();
const { auth, isAdmin } = require("../Middlewares/authMiddleware");
const { 
    createWithdrawalRequest, 
    processWithdrawalRequest,
    getAllWithdrawalRequests 
} = require("../Controllers/withdrawalController");

// User routes
router.post("/request", auth, createWithdrawalRequest);

// Admin routes
router.get("/requests", auth, isAdmin, getAllWithdrawalRequests);
router.put("/process/:requestId", auth, isAdmin, processWithdrawalRequest);

module.exports = router;
