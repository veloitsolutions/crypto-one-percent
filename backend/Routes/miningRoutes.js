

//miningRoutes
const express = require("express");
const router = express.Router();
const { auth } = require("../Middlewares/authMiddleware");
const { mineTokens, getTokenBalance } = require("../Controllers/MiningController");

router.post("/mine", auth, mineTokens);
router.get("/balance", auth, getTokenBalance);

module.exports = router;

