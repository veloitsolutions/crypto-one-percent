

// src/api/referral.js
import axios from 'axios';

const BASE_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/admin/referral-rewards`;

// Get all pending referral rewards (admin only)
export const getPendingReferralRewards = () => {
    return axios.get(`${BASE_URL}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        withCredentials: true
    });
};

export const approveReferralReward = (rewardId) => {
    return axios.post(`${BASE_URL}/${rewardId}/approve`,
        { status: 'approved' },
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            withCredentials: true
        }
    );
};

// Reject a referral reward (admin only)
export const rejectReferralReward = (rewardId) => {
    return axios.post(`${BASE_URL}/${rewardId}/reject`,
        { status: 'rejected' },
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            withCredentials: true
        }
    );
};

// Get referral reward details (admin only)
export const getReferralRewardDetails = (rewardId) => {
    return axios.get(`${BASE_URL}/${rewardId}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        withCredentials: true
    });
};

// Get user's referral history (user & admin)
export const getUserReferralHistory = (userId) => {
    return axios.get(`${BASE_URL}/history/${userId}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        withCredentials: true
    });
};

// Handle axios errors
export const handleReferralError = (error) => {
    if (error.response) {
        return {
            success: false,
            message: error.response.data.message || 'Request failed',
            status: error.response.status
        };
    } else if (error.request) {
        return {
            success: false,
            message: 'No response from server',
            status: 503
        };
    } else {
        return {
            success: false,
            message: 'Request setup failed',
            status: 500
        };
    }
};

// Constants for referral reward status
export const REFERRAL_STATUS = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected'
};

// Utility function to format reward amount
export const formatRewardAmount = (amount) => {
    return parseFloat(amount).toFixed(2);
};

// Validation functions
export const validateReferralReward = (reward) => {
    if (!reward.referrer || !reward.referee) {
        return {
            isValid: false,
            message: 'Missing referrer or referee information'
        };
    }

    if (!reward.amount || isNaN(reward.amount)) {
        return {
            isValid: false,
            message: 'Invalid reward amount'
        };
    }

    const rewardAmount = parseFloat(reward.amount);

    if (rewardAmount <= 0) {
        return {
            isValid: false,
            message: 'Reward amount must be greater than 0'
        };
    }

    return {
        isValid: true,
        message: ''
    };
};