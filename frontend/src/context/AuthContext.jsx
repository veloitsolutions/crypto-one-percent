

// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (token && savedUser) {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback((token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsLoggedIn(true);
    setUser(userData);
  }, []);

  const logout = useCallback(async () => {
    // Clear state immediately for smooth UX
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Try to call logout API in background, but don't wait for it
    try {
      const token = localStorage.getItem('token');
      if (token) {
        // Call API but don't await it - fire and forget
        axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/logout`, {}, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        }).catch(() => {
          // Ignore errors - user is already logged out locally
        });
      }
    } catch (error) {
      // Ignore errors - user is already logged out locally
    }
  }, []);

  const value = {
    isLoggedIn,
    user,
    login,
    logout,
    isLoading,
    isAdmin: user?.role === 'Admin',
    isInvestor: user?.role === 'Investor'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
