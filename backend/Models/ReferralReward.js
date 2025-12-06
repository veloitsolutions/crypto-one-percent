

// Models/ReferralReward.js
const mongoose = require('mongoose');

const referralRewardSchema = new mongoose.Schema({
    referrer: {
        type: String,  // userId of the referrer
        required: true
    },
    referee: {
        type: String,  // userId of the person who signed up
        required: true
    },
    amount: {
        type: Number,
        default: 50
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ReferralReward', referralRewardSchema);
