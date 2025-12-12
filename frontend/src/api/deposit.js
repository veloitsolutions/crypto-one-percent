
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/deposit`;

export const createDepositRequest = async (amount, transactionId) => {
    const token = localStorage.getItem('token');
    return axios.post(`${API_URL}/request`, { amount, transactionId }, {
        headers: {
            Authorization: `Bearer ${token}`
        },
        withCredentials: true
    });
};

export const getAllDepositRequests = async () => {
    const token = localStorage.getItem('token');
    return axios.get(`${API_URL}/requests`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
        withCredentials: true
    });
};

export const processDepositRequest = async (requestId, status) => {
    const token = localStorage.getItem('token');
    return axios.put(`${API_URL}/process/${requestId}`, { status }, {
        headers: {
            Authorization: `Bearer ${token}`
        },
        withCredentials: true
    });
};
