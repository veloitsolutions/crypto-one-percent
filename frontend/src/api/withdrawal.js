

//withdrawal.js
import axios from 'axios';

const BASE_URL = 'http://localhost:4000/api/withdrawal';

// Get all withdrawal requests (admin only)
export const getAllWithdrawalRequests = () => {
    return axios.get(`${BASE_URL}/requests`, {
        headers: { 
            Authorization: `Bearer ${localStorage.getItem('token')}` 
        },
        withCredentials: true
    });
};

// Create a new withdrawal request (user)
export const createWithdrawalRequest = (amount) => {
    return axios.post(`${BASE_URL}/request`, 
        { amount },
        {
            headers: { 
                Authorization: `Bearer ${localStorage.getItem('token')}` 
            },
            withCredentials: true
        }
    );
};

// Process a withdrawal request (admin only)
export const processWithdrawalRequest = (requestId, status) => {
    return axios.put(`${BASE_URL}/process/${requestId}`,
        { status },
        {
            headers: { 
                Authorization: `Bearer ${localStorage.getItem('token')}` 
            },
            withCredentials: true
        }
    );
};

// Get user's withdrawal history (user)
export const getUserWithdrawalHistory = () => {
    return axios.get(`${BASE_URL}/history`, {
        headers: { 
            Authorization: `Bearer ${localStorage.getItem('token')}` 
        },
        withCredentials: true
    });
};

// Get withdrawal request details (admin & user)
export const getWithdrawalRequestDetails = (requestId) => {
    return axios.get(`${BASE_URL}/request/${requestId}`, {
        headers: { 
            Authorization: `Bearer ${localStorage.getItem('token')}` 
        },
        withCredentials: true
    });
};

// Handle axios errors
export const handleWithdrawalError = (error) => {
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        return {
            success: false,
            message: error.response.data.message || 'Request failed',
            status: error.response.status
        };
    } else if (error.request) {
        // The request was made but no response was received
        return {
            success: false,
            message: 'No response from server',
            status: 503
        };
    } else {
        // Something happened in setting up the request that triggered an Error
        return {
            success: false,
            message: 'Request setup failed',
            status: 500
        };
    }
};

// Utility function to format withdrawal amounts
export const formatWithdrawalAmount = (amount) => {
    return parseFloat(amount).toFixed(2);
};

// Constants for withdrawal status
export const WITHDRAWAL_STATUS = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected'
};

// Validation functions
export const validateWithdrawalAmount = (amount, balance) => {
    if (!amount || isNaN(amount)) {
        return {
            isValid: false,
            message: 'Please enter a valid amount'
        };
    }

    const withdrawalAmount = parseFloat(amount);
    
    if (withdrawalAmount <= 0) {
        return {
            isValid: false,
            message: 'Withdrawal amount must be greater than 0'
        };
    }

    if (withdrawalAmount > balance) {
        return {
            isValid: false,
            message: 'Insufficient balance'
        };
    }

    return {
        isValid: true,
        message: ''
    };
};