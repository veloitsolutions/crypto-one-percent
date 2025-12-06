

import React, { useEffect, useState } from "react";
import axios from "axios";
import "./dashboard.css";

const WithdrawalModal = ({ isOpen, onClose, tokenBalance, onWithdraw }) => {
    const [amount, setAmount] = useState('');
    const [link, setLink] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post(
                'http://localhost:4000/api/withdrawal/request',
                { amount: Number(amount),
                    link: link
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            if (response.data.success) {
                onWithdraw();
                onClose();
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to create withdrawal request');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Withdraw Tokens</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit} className="withdrawal-form">
                    <div className="form-group">
                        <label>Available Balance:</label>
                        <p>{tokenBalance.toFixed(2)} tokens</p>
                    </div>

                    <div className="form-group">
                        <label>Withdrawal Amount:</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            max={tokenBalance}
                            min="0"
                            step="0.01"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Payment Link:</label>
                        <input
                            type="text"
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                            placeholder="Enter your payment link"
                            required
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <div className="form-buttons">
                        <button 
                            type="submit" 
                            className="submit-btn"
                            disabled={loading || !amount || Number(amount) > tokenBalance}
                        >
                            {loading ? 'Processing...' : 'Submit Withdrawal'}
                        </button>
                        <button 
                            type="button" 
                            className="cancel-btn"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [miningStatus, setMiningStatus] = useState("");
    const [nextMiningTime, setNextMiningTime] = useState(null);
    const [countdown, setCountdown] = useState(null);
    const [pendingIncrease, setPendingIncrease] = useState(null);
    const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
    const [pendingWithdrawal, setPendingWithdrawal] = useState(null);
    const [miningBalance, setMiningBalance] = useState(0);

    useEffect(() => {
        fetchUserData();
        fetchTokenBalance();
    }, []);

    useEffect(() => {
        let timer;
        if (nextMiningTime && new Date(nextMiningTime) > new Date()) {
            timer = setInterval(() => {
                const now = new Date();
                const timeLeft = new Date(nextMiningTime) - now;
                
                if (timeLeft <= 0) {
                    setCountdown(null);
                    clearInterval(timer);
                    
                    if (pendingIncrease) {
                        setUser(prev => ({
                            ...prev,
                            tokenBalance: pendingIncrease.newBalance
                        }));
                        setMiningStatus("Mining completed! +" + (pendingIncrease.increase).toFixed(2) + " tokens");
                        setPendingIncrease(null);
                        
                        setTimeout(() => setMiningStatus(""), 3000);
                    }
                } else {
                    const totalSeconds = Math.ceil(timeLeft / 1000);
                    setCountdown(totalSeconds);
                }
            }, 1000);
        }

        return () => {
            if (timer) clearInterval(timer);
        };
    }, [nextMiningTime, pendingIncrease]);

    const fetchUserData = async () => {
        try {
            const storedToken = localStorage.getItem("token");
            if (!storedToken) {
                setError("No token found. Please log in.");
                setLoading(false);
                return;
            }

            const response = await axios.get("http://localhost:4000/api/me", {
                headers: { 
                    Authorization: `Bearer ${storedToken}`,
                },
                withCredentials: true 
            });

            if (response.data.success) {
                setUser(response.data.user);
            } else {
                setError("Failed to fetch user data.");
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            handleError(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTokenBalance = async () => {
        try {
            const storedToken = localStorage.getItem("token");
            const response = await axios.get("http://localhost:4000/api/mining/balance", {
                headers: {
                    Authorization: `Bearer ${storedToken}`
                },
                withCredentials: true
            });

            if (response.data.success) {
                const { tokenBalance, miningBalance, pendingWithdrawal, nextMiningAvailable } = response.data.data;
                
                setUser(prev => ({
                    ...prev,
                    tokenBalance: tokenBalance
                }));
                setMiningBalance(miningBalance);
                setPendingWithdrawal(pendingWithdrawal);
                
                if (nextMiningAvailable) {
                    const nextTime = new Date(nextMiningAvailable);
                    if (nextTime > new Date()) {
                        setNextMiningTime(nextTime);
                        const timeLeft = nextTime - new Date();
                        setCountdown(Math.ceil(timeLeft / 1000));
                    }
                }
            }
        } catch (error) {
            console.error("Error fetching token balance:", error);
            handleError(error);
        }
    };

    const handleMining = async () => {
        try {
            const storedToken = localStorage.getItem("token");
            const response = await axios.post("http://localhost:4000/api/mining/mine", {}, {
                headers: {
                    Authorization: `Bearer ${storedToken}`
                },
                withCredentials: true
            });

            if (response.data.success) {
                setPendingIncrease({
                    increase: response.data.data.increase,
                    newBalance: response.data.data.newBalance
                });
                setNextMiningTime(response.data.data.nextMiningAvailable);
                setMiningStatus("Mining started! Tokens will be added in 24 hours.");
                
                // Update mining balance
                setMiningBalance(response.data.data.miningBalance);
            }
        } catch (error) {
            console.error("Mining error:", error);
            if (error.response?.data?.message) {
                setMiningStatus(error.response.data.message);
            } else {
                setMiningStatus("Mining failed. Please try again later.");
            }
            setTimeout(() => setMiningStatus(""), 3000);
        }
    };

    const handleError = (error) => {
        if (error.response?.status === 401) {
            setError("Session expired. Please login again.");
            localStorage.removeItem("token");
        } else {
            setError("An error occurred while fetching data.");
        }
    };

    const formatTokenBalance = (balance) => {
        return parseFloat(balance).toFixed(2);
    };

    const formatCountdown = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        if (hours > 0) {
            return `${hours}h ${minutes}m ${seconds}s`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds}s`;
        }
        return `${seconds}s`;
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!user) return <div className="no-user">No user data found.</div>;

    return (
        <div className="dashboard-container">
            <img src="/water.webp" alt="Left Graphic" className="dashboard-image left" />

            <div className="dashboard">
                <div className="user-info">
                    <div className="info-item">
                        <span className="label">User ID:</span>
                        <span className="value">{user.userId}</span>
                    </div>
                    <div className="info-item">
                        <span className="label">Name:</span>
                        <span className="value">{user.name}</span>
                    </div>
                    <div className="info-item">
                        <span className="label">Email:</span>
                        <span className="value">{user.email}</span>
                    </div>
                    <div className="info-item">
                        <span className="label">Phone:</span>
                        <span className="value">{user.phone}</span>
                    </div>
                    <div className="info-item">
                        <span className="label">Role:</span>
                        <span className="value">{user.role}</span>
                    </div>
                </div>

                <div className="token-box">
                    <div className="token-header">Token Balance</div>
                    <div className="token-value">
                        {formatTokenBalance(user.tokenBalance)}
                        {pendingIncrease && (
                            <span className="pending-increase">
                                (+{pendingIncrease.increase.toFixed(2)} pending)
                            </span>
                        )}
                    </div>
                    
                    {pendingWithdrawal > 0 && (
                        <div className="pending-withdrawal-info">
                            <div className="withdrawal-amount">
                                Pending Withdrawal: {pendingWithdrawal.toFixed(2)} tokens
                            </div>
                            <div className="mining-balance">
                                Available for Mining: {miningBalance.toFixed(2)} tokens
                            </div>
                        </div>
                    )}

<div className="action-buttons">
                        <button
                            className={`mine-button ${countdown !== null ? 'disabled' : ''}`}
                            onClick={handleMining}
                            disabled={countdown !== null}
                        >
                            {countdown !== null ? 'COOLDOWN' : 'MINE'}
                        </button>
                    </div>

                    {miningStatus && (
                        <div className={`mining-status ${miningStatus.includes('successful') || miningStatus.includes('started') ? 'success' : 'error'}`}>
                            {miningStatus}
                        </div>
                    )}
                    {countdown && (
                        <div className="next-mining-time">
                            Mining completes in: {formatCountdown(countdown)}
                        </div>
                    )}
                </div>

                <div className="button-container">
                    <button className="add-token-button">
                        Add Tokens
                    </button>
                    <button 
                        className={`withdraw-button ${user.hasActiveWithdrawal ? 'disabled' : ''}`}
                        onClick={() => setShowWithdrawalModal(true)}
                        disabled={user.hasActiveWithdrawal}
                    >
                        {user.hasActiveWithdrawal ? `Withdrawal Pending (${pendingWithdrawal.toFixed(2)} tokens)` : 'Withdraw'}
                    </button>
                </div>

                {showWithdrawalModal && (
                    <WithdrawalModal
                        isOpen={showWithdrawalModal}
                        onClose={() => setShowWithdrawalModal(false)}
                        tokenBalance={user.tokenBalance}
                        onWithdraw={fetchUserData}
                    />
                )}
            </div>
            <img src="/water.webp" alt="Right Graphic" className="dashboard-image right" />
        </div>
    );
};

export default Dashboard;