
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/tasks`;

export const getTasks = async () => {
    const token = localStorage.getItem('token');
    return axios.get(`${API_URL}`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
        withCredentials: true
    });
};

export const createTask = async (taskData) => {
    const token = localStorage.getItem('token');
    return axios.post(`${API_URL}`, taskData, {
        headers: {
            Authorization: `Bearer ${token}`
        },
        withCredentials: true
    });
};

export const completeTask = async (taskId) => {
    const token = localStorage.getItem('token');
    return axios.post(`${API_URL}/complete/${taskId}`, {}, {
        headers: {
            Authorization: `Bearer ${token}`
        },
        withCredentials: true
    });
};

export const deleteTask = async (taskId) => {
    const token = localStorage.getItem('token');
    return axios.delete(`${API_URL}/${taskId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
        withCredentials: true
    });
};
