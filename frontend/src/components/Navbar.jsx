
//Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { isLoggedIn, logout, user } = useAuth();
  const navigate = useNavigate();
  const [isMainTab, setIsMainTab] = useState(true);

  // Check if this is the admin dashboard tab
  const isAdminDashboard = window.location.pathname === '/admin/dashboard';

  // Determine if this is the main tab or admin dashboard tab
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const isNewTab = urlParams.get('newTab') === 'true';
    setIsMainTab(!isNewTab);
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        credentials: 'include'
      });

      if (response.ok) {
        logout();
        setShowLogoutModal(false);
        if (isAdminDashboard) {
          window.close();
        } else {
          setTimeout(() => { navigate('/login'); }, 0);
        }
      }
    } catch (error) {
      console.error('Logout error:', error);
      logout();
      navigate('/login');
    }
  };

  // Determine what navigation items to show
  const renderNavItems = () => {
    // For admin user in main tab
    if (user?.role === 'Admin' && isMainTab) {
      return (
        <>
          <li>
            <NavLink to="/login">Login</NavLink>
          </li>
          <li>
            <NavLink to="/signup">SignUp</NavLink>
          </li>
        </>
      );
    }

    // For admin user in dashboard tab
    if (user?.role === 'Admin' && isAdminDashboard) {
      return (
        <li className="logout-item">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="nav-button"
          >
            Logout
          </button>
        </li>
      );
    }

    // For regular investor users
    if (isLoggedIn) {
      return (
        <>
          {user?.role !== 'Admin' && (
            <li>
              <NavLink
                to="/dashboard"
                onClick={() => setMenuOpen(false)}
              >
                My Portfolio
              </NavLink>
            </li>
          )}
          <li className="logout-item">
            <button
              onClick={() => setShowLogoutModal(true)}
              className="nav-button"
            >
              Logout
            </button>
          </li>
        </>
      );
    }

    // Default navigation for non-logged in users
    return (
      <>
        <li>
          <NavLink
            to="/login"
            onClick={() => setMenuOpen(false)}
          >
            Login
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/signup"
            onClick={() => setMenuOpen(false)}
          >
            SignUp
          </NavLink>
        </li>
      </>
    );
  };

  return (
    <>
      <nav>
        {/* Left side - Title */}
        {(!isLoggedIn || (user?.role !== 'Admin' || !isAdminDashboard)) && (
          <Link to="/" className="title">
            OnePercent
          </Link>
        )}

        {/* Right side - Navigation */}
        <div className="nav-right">
          <div className="menu" onClick={() => setMenuOpen(!menuOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <ul className={menuOpen ? "open" : ""}>
            {renderNavItems()}
          </ul>
        </div>
      </nav>

      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Confirm Logout</h2>
            <p>Are you sure you want to logout?</p>
            <div className="modal-buttons">
              <button
                onClick={handleLogout}
                className="modal-button confirm"
              >
                Yes, Logout
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="modal-button cancel"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};