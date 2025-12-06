

// Models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["Investor", "Admin"]
    },
    tokenBalance: {
        type: Number,
        default: 0
    },
    lastMiningTimestamp: {
        type: Date,
        default: null
    },
    hasActiveWithdrawal: {
        type: Boolean,
        default: false
    },
    referralCode: {  // This will be the same as userId
        type: String,
        unique: true
    },
    referredBy: {
        type: String,
        default: null
    },
    pendingReferralRewards: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ReferralReward'
    }]
});

module.exports = mongoose.model('User', userSchema);
