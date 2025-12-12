
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/settings`;

export const getDashboardImages = async () => {
    return axios.get(`${API_URL}/images`);
};

export const updateDashboardImages = async (images) => {
    const token = localStorage.getItem('token');
    return axios.post(`${API_URL}/images`, { images }, {
        headers: {
            Authorization: `Bearer ${token}`
        },
        withCredentials: true
    });
};
