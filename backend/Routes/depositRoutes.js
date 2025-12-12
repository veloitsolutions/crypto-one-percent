
const express = require("express");
const router = express.Router();
const { auth, isAdmin } = require("../Middlewares/authMiddleware");
const {
    createDepositRequest,
    getAllDepositRequests,
    processDepositRequest
} = require("../Controllers/depositController");

// User routes
router.post("/request", auth, createDepositRequest);

// Admin routes
router.get("/requests", auth, isAdmin, getAllDepositRequests);
router.put("/process/:requestId", auth, isAdmin, processDepositRequest);

module.exports = router;
