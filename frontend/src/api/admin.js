

// src/api/admin.js
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/admin`;

export const getAllUsers = async () => {
    const token = localStorage.getItem('token');
    return axios.get(`${API_URL}/users`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
        withCredentials: true
    });
};

export const getUserDetails = async (userId) => {
    const token = localStorage.getItem('token');
    return axios.get(`${API_URL}/users/${userId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
        withCredentials: true
    });
};

export const editUser = async (userId, userData) => {
    const token = localStorage.getItem('token');
    return axios.put(`${API_URL}/users/${userId}`, userData, {
        headers: {
            Authorization: `Bearer ${token}`
        },
        withCredentials: true
    });
};