

// // // Models/WithdrawalRequest.js
const mongoose = require('mongoose');

const withdrawalRequestSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    link: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    requestDate: {
        type: Date,
        default: Date.now
    },
    processedDate: {
        type: Date
    }
});

module.exports = mongoose.model('WithdrawalRequest', withdrawalRequestSchema);