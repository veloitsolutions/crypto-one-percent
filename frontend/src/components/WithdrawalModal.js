// // Components/WithdrawalModal.js
// import React, { useState } from 'react';
// import axios from 'axios';

// export const WithdrawalModal = ({ isOpen, onClose, tokenBalance, onWithdraw }) => {
//     const [amount, setAmount] = useState('');
//     const [error, setError] = useState('');
//     const [loading, setLoading] = useState(false);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError('');
//         setLoading(true);

//         try {
//             const response = await axios.post(
//                 'http://localhost:4000/api/withdrawal/request',
//                 { amount: Number(amount) },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${localStorage.getItem('token')}`
//                     }
//                 }
//             );

//             if (response.data.success) {
//                 onWithdraw();
//                 onClose();
//             }
//         } catch (error) {
//             setError(error.response?.data?.message || 'Failed to create withdrawal request');
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (!isOpen) return null;

//     return (
//         <div className="modal-overlay">
//             <div className="modal-content">
//                 <div className="modal-header">
//                     <h2>Withdraw Tokens</h2>
//                     <button className="modal-close" onClick={onClose}>×</button>
//                 </div>

//                 <form onSubmit={handleSubmit} className="withdrawal-form">
//                     <div className="form-group">
//                         <label>Available Balance:</label>
//                         <p>{tokenBalance.toFixed(2)} tokens</p>
//                     </div>

//                     <div className="form-group">
//                         <label>Withdrawal Amount:</label>
//                         <input
//                             type="number"
//                             value={amount}
//                             onChange={(e) => setAmount(e.target.value)}
//                             max={tokenBalance}
//                             min="0"
//                             step="0.01"
//                             required
//                         />
//                     </div>

//                     {error && <div className="error-message">{error}</div>}

//                     <div className="form-buttons">
//                         <button 
//                             type="submit" 
//                             className="submit-btn"
//                             disabled={loading || !amount || Number(amount) > tokenBalance}
//                         >
//                             {loading ? 'Processing...' : 'Submit Withdrawal'}
//                         </button>
//                         <button 
//                             type="button" 
//                             className="cancel-btn"
//                             onClick={onClose}
//                             disabled={loading}
//                         >
//                             Cancel
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };