import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/mining`;

export const getMiningDetails = async () => {
    const token = localStorage.getItem('token');
    return axios.get(`${API_URL}/balance`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
        withCredentials: true
    });
};

export const mineTokens = async () => {
    const token = localStorage.getItem('token');
    return axios.post(`${API_URL}/mine`, {}, {
        headers: {
            Authorization: `Bearer ${token}`
        },
        withCredentials: true
    });
};
