
//ProtectedRoutes.jsx
import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, requiredRole }) => {
  const [loading, setLoading] = useState(true);
  const { isLoggedIn, login, logout, user, isLoading: authLoading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (!token || !userData) {
          setLoading(false);
          return;
        }

        const parsedUserData = JSON.parse(userData);

        const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        });

        if (response.data.success) {
          login(token, parsedUserData);
        } else {
          await logout();
        }
      } catch (error) {
        console.error('Authentication error:', error);
        await logout();
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, [login, logout]);

  // Wait for both auth context and local loading state
  if (authLoading || loading) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    const currentPath = location.pathname;
    localStorage.setItem('redirectPath', currentPath);
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};
