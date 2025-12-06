

// //AdminDashboard.jsx
// import React, { useState, useEffect } from 'react';
// import { getAllUsers, getUserDetails, editUser } from '../../../../api/admin';
// import { getAllWithdrawalRequests, processWithdrawalRequest } from '../../../../api/withdrawal';
// import './AdminDashboard.css';

// const PaymentModal = ({ request, onClose, onProcess }) => {
//     return (
//         <div className="modal-overlay">
//             <div className="modal-content">
//                 <div className="modal-header">
//                     <h2>Process Payment</h2>
//                     <button className="modal-close" onClick={onClose}>×</button>
//                 </div>
                
//                 <div className="payment-details">
//                     <div className="detail-group">
//                         <label>Name:</label>
//                         <p>{request.user.name}</p>
//                     </div>
//                     <div className="detail-group">
//                         <label>Email:</label>
//                         <p>{request.user.email}</p>
//                     </div>
//                     <div className="detail-group">
//                         <label>Amount:</label>
//                         <p>{request.amount} tokens</p>
//                     </div>
//                     <div className="detail-group">
//                         <label>Payment Link:</label>
//                         <p className="payment-link">
//                             <a href={request.link} target="_blank" rel="noopener noreferrer">
//                                 {request.link}
//                             </a>
//                         </p>
//                     </div>
//                 </div>

//                 <div className="modal-actions">
//                     <button
//                         onClick={() => onProcess(request._id, 'approved')}
//                         className="approve-btn"
//                     >
//                         Approve
//                     </button>
//                     <button
//                         onClick={() => onProcess(request._id, 'rejected')}
//                         className="reject-btn"
//                     >
//                         Reject
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// const UserDetailsModal = ({ user, onClose, onEdit, editMode, editedTokenBalance, setEditedTokenBalance, handleSubmit, updateMessage }) => {
//     return (
//         <div className="modal-overlay">
//             <div className="modal-content">
//                 <div className="modal-header">
//                     <h2>User Details</h2>
//                     <button className="modal-close" onClick={onClose}>×</button>
//                 </div>
                
//                 {updateMessage && (
//                     <div className={`update-message ${updateMessage.includes('successfully') ? 'success' : 'error'}`}>
//                         {updateMessage}
//                     </div>
//                 )}

//                 {editMode ? (
//                     <form onSubmit={handleSubmit} className="edit-form">
//                         <div className="form-group">
//                             <label>User ID:</label>
//                             <p>{user.userId}</p>
//                         </div>
//                         <div className="form-group">
//                             <label>Name:</label>
//                             <p>{user.name}</p>
//                         </div>
//                         <div className="form-group">
//                             <label>Email:</label>
//                             <p>{user.email}</p>
//                         </div>
//                         <div className="form-group">
//                             <label>Phone:</label>
//                             <p>{user.phone}</p>
//                         </div>
//                         <div className="form-group">
//                             <label>Token Balance:</label>
//                             <input
//                                 type="number"
//                                 value={editedTokenBalance}
//                                 onChange={(e) => setEditedTokenBalance(e.target.value)}
//                                 step="0.01"
//                             />
//                         </div>
//                         <div className="form-buttons">
//                             <button type="submit" className="save-btn">Save</button>
//                             <button 
//                                 type="button" 
//                                 onClick={() => {
//                                     onEdit(false);
//                                     setEditedTokenBalance(user.tokenBalance);
//                                 }}
//                                 className="cancel-btn"
//                             >
//                                 Cancel
//                             </button>
//                         </div>
//                     </form>
//                 ) : (
//                     <div className="user-info">
//                         <p><strong>User ID:</strong> {user.userId}</p>
//                         <p><strong>Name:</strong> {user.name}</p>
//                         <p><strong>Email:</strong> {user.email}</p>
//                         <p><strong>Phone:</strong> {user.phone}</p>
//                         <p><strong>Role:</strong> {user.role}</p>
//                         <p><strong>Token Balance:</strong> {user.tokenBalance}</p>
//                         <button onClick={() => onEdit(true)} className="edit-btn">
//                             Edit Token Balance
//                         </button>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export const AdminDashboard = () => {
//     const [users, setUsers] = useState([]);
//     const [selectedUser, setSelectedUser] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');
//     const [editMode, setEditMode] = useState(false);
//     const [editedTokenBalance, setEditedTokenBalance] = useState('');
//     const [updateMessage, setUpdateMessage] = useState('');
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [withdrawalRequests, setWithdrawalRequests] = useState([]);
//     const [processingWithdrawal, setProcessingWithdrawal] = useState(false);
//     const [showPaymentModal, setShowPaymentModal] = useState(false);
//     const [selectedRequest, setSelectedRequest] = useState(null);

//     useEffect(() => {
//         fetchUsers();
//         fetchWithdrawalRequests();
//     }, []);

//     const fetchWithdrawalRequests = async () => {
//         try {
//             const response = await getAllWithdrawalRequests();
//             if (response.data.success) {
//                 setWithdrawalRequests(response.data.requests);
//             }
//         } catch (error) {
//             console.error('Error fetching withdrawal requests:', error);
//             setError('Failed to load withdrawal requests');
//         }
//     };

//     const fetchUsers = async () => {
//         try {
//             const response = await getAllUsers();
//             if (response.data.success) {
//                 setUsers(response.data.users);
//             }
//         } catch (error) {
//             console.error('Error fetching users:', error);
//             setError('Failed to load users');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleUserClick = async (userId) => {
//         try {
//             const response = await getUserDetails(userId);
//             if (response.data.success) {
//                 setSelectedUser(response.data.user);
//                 setEditedTokenBalance(response.data.user.tokenBalance);
//                 setEditMode(false);
//                 setIsModalOpen(true);
//             }
//         } catch (error) {
//             console.error('Error fetching user details:', error);
//             setError('Failed to load user details');
//         }
//     };

//     const handleWithdrawalProcess = async (requestId, status) => {
//         setProcessingWithdrawal(true);
//         try {
//             const response = await processWithdrawalRequest(requestId, status);
//             if (response.data.success) {
//                 setUpdateMessage(`Withdrawal request ${status} successfully`);
//                 await Promise.all([
//                     fetchWithdrawalRequests(),
//                     fetchUsers()
//                 ]);
//                 setShowPaymentModal(false);
//                 setSelectedRequest(null);
//             }
//         } catch (error) {
//             setUpdateMessage(error.response?.data?.message || `Failed to ${status} withdrawal request`);
//         } finally {
//             setProcessingWithdrawal(false);
//             setTimeout(() => setUpdateMessage(''), 3000);
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await editUser(selectedUser._id, {
//                 tokenBalance: Number(editedTokenBalance)
//             });

//             if (response.data.success) {
//                 setUpdateMessage('Token balance updated successfully!');
//                 setSelectedUser(response.data.user);
//                 setEditMode(false);
//                 fetchUsers();
//                 setTimeout(() => setUpdateMessage(''), 3000);
//             }
//         } catch (error) {
//             setUpdateMessage(error.response?.data?.message || 'Failed to update token balance');
//             setTimeout(() => setUpdateMessage(''), 3000);
//         }
//     };

//     if (loading) return <div className="loading">Loading...</div>;
//     if (error) return <div className="error">{error}</div>;

//     return (
//         <div className="admin-dashboard">
//             <h1>Admin Dashboard</h1>
            
//             {/* Withdrawal Requests Section */}
//             <div className="withdrawal-requests-section">
//                 <h2>Pending Withdrawal Requests</h2>
//                 <div className="withdrawal-requests-list">
//                     {withdrawalRequests
//                         .filter(request => request.status === 'pending')
//                         .map((request) => (
//                             <div key={request._id} className="withdrawal-request-card">
//                                 <div className="request-info">
//                                     <p><strong>User:</strong> {request.user.name}</p>
//                                     <p><strong>Amount:</strong> {request.amount} tokens</p>
//                                     <p><strong>Requested:</strong> {new Date(request.requestDate).toLocaleDateString()}</p>
//                                 </div>
//                                 <div className="request-actions">
//                                     <button
//                                         onClick={() => {
//                                             setSelectedRequest(request);
//                                             setShowPaymentModal(true);
//                                         }}
//                                         disabled={processingWithdrawal}
//                                         className="pay-btn"
//                                     >
//                                         Pay
//                                     </button>
//                                 </div>
//                             </div>
//                         ))}
//                 </div>
//             </div>

//             {/* Users List Section */}
//             <div className="users-list">
//                 <h2>Investors List</h2>
//                 <table className="users-table">
//                     <thead>
//                         <tr>
//                             <th>User ID</th>
//                             <th>Name</th>
//                             <th>Email</th>
//                             <th>Phone</th>
//                             <th>Token Balance</th>
//                             <th>Action</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {users.map((user) => (
//                             <tr key={user._id}>
//                                 <td>{user.userId}</td>
//                                 <td>{user.name}</td>
//                                 <td>{user.email}</td>
//                                 <td>{user.phone}</td>
//                                 <td>{user.tokenBalance}</td>
//                                 <td className="action-buttons">
//                                     <button
//                                         onClick={() => handleUserClick(user._id)}
//                                         className="view-details-btn"
//                                     >
//                                         View Details
//                                     </button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>

//             {/* Modals */}
//             {showPaymentModal && selectedRequest && (
//                 <PaymentModal
//                     request={selectedRequest}
//                     onClose={() => {
//                         setShowPaymentModal(false);
//                         setSelectedRequest(null);
//                     }}
//                     onProcess={handleWithdrawalProcess}
//                 />
//             )}

//             {isModalOpen && selectedUser && (
//                 <UserDetailsModal
//                     user={selectedUser}
//                     onClose={() => {
//                         setIsModalOpen(false);
//                         setSelectedUser(null);
//                         setEditMode(false);
//                         setUpdateMessage('');
//                     }}
//                     onEdit={setEditMode}
//                     editMode={editMode}
//                     editedTokenBalance={editedTokenBalance}
//                     setEditedTokenBalance={setEditedTokenBalance}
//                     handleSubmit={handleSubmit}
//                     updateMessage={updateMessage}
//                 />
//             )}
//         </div>
//     );
// };

// export default AdminDashboard;


// //AdminDashboard.jsx
// import React, { useState, useEffect } from 'react';
// import { getAllUsers, getUserDetails, editUser } from '../../../../api/admin';
// import { getAllWithdrawalRequests, processWithdrawalRequest } from '../../../../api/withdrawal';
// import './AdminDashboard.css';

// const PaymentModal = ({ request, onClose, onProcess }) => {
//     return (
//         <div className="modal-overlay">
//             <div className="modal-content">
//                 <div className="modal-header">
//                     <h2>Process Payment</h2>
//                     <button className="modal-close" onClick={onClose}>×</button>
//                 </div>
                
//                 <div className="payment-details">
//                     <div className="detail-group">
//                         <label>Name:</label>
//                         <p>{request.user.name}</p>
//                     </div>
//                     <div className="detail-group">
//                         <label>Email:</label>
//                         <p>{request.user.email}</p>
//                     </div>
//                     <div className="detail-group">
//                         <label>Amount:</label>
//                         <p>{request.amount} tokens</p>
//                     </div>
//                     <div className="detail-group">
//                         <label>Payment Link:</label>
//                         <p className="payment-link">
//                             <a href={request.link} target="_blank" rel="noopener noreferrer">
//                                 {request.link}
//                             </a>
//                         </p>
//                     </div>
//                 </div>

//                 <div className="modal-actions">
//                     <button
//                         onClick={() => onProcess(request._id, 'approved')}
//                         className="approve-btn"
//                     >
//                         Approve
//                     </button>
//                     <button
//                         onClick={() => onProcess(request._id, 'rejected')}
//                         className="reject-btn"
//                     >
//                         Reject
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// const UserDetailsModal = ({ user, onClose, onEdit, editMode, editedTokenBalance, setEditedTokenBalance, handleSubmit, updateMessage }) => {
//     return (
//         <div className="modal-overlay">
//             <div className="modal-content">
//                 <div className="modal-header">
//                     <h2>User Details</h2>
//                     <button className="modal-close" onClick={onClose}>×</button>
//                 </div>
                
//                 {updateMessage && (
//                     <div className={`update-message ${updateMessage.includes('successfully') ? 'success' : 'error'}`}>
//                         {updateMessage}
//                     </div>
//                 )}

//                 {editMode ? (
//                     <form onSubmit={handleSubmit} className="edit-form">
//                         <div className="form-group">
//                             <label>User ID:</label>
//                             <p>{user.userId}</p>
//                         </div>
//                         <div className="form-group">
//                             <label>Name:</label>
//                             <p>{user.name}</p>
//                         </div>
//                         <div className="form-group">
//                             <label>Email:</label>
//                             <p>{user.email}</p>
//                         </div>
//                         <div className="form-group">
//                             <label>Phone:</label>
//                             <p>{user.phone}</p>
//                         </div>
//                         <div className="form-group">
//                             <label>Token Balance:</label>
//                             <input
//                                 type="number"
//                                 value={editedTokenBalance}
//                                 onChange={(e) => setEditedTokenBalance(e.target.value)}
//                                 step="0.01"
//                             />
//                         </div>
//                         <div className="form-buttons">
//                             <button type="submit" className="save-btn">Save</button>
//                             <button 
//                                 type="button" 
//                                 onClick={() => {
//                                     onEdit(false);
//                                     setEditedTokenBalance(user.tokenBalance);
//                                 }}
//                                 className="cancel-btn"
//                             >
//                                 Cancel
//                             </button>
//                         </div>
//                     </form>
//                 ) : (
//                     <div className="user-info">
//                         <p><strong>User ID:</strong> {user.userId}</p>
//                         <p><strong>Name:</strong> {user.name}</p>
//                         <p><strong>Email:</strong> {user.email}</p>
//                         <p><strong>Phone:</strong> {user.phone}</p>
//                         <p><strong>Role:</strong> {user.role}</p>
//                         <p><strong>Token Balance:</strong> {user.tokenBalance}</p>
//                         <button onClick={() => onEdit(true)} className="edit-btn">
//                             Edit Token Balance
//                         </button>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export const AdminDashboard = () => {
//     const [users, setUsers] = useState([]);
//     const [selectedUser, setSelectedUser] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');
//     const [editMode, setEditMode] = useState(false);
//     const [editedTokenBalance, setEditedTokenBalance] = useState('');
//     const [updateMessage, setUpdateMessage] = useState('');
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [withdrawalRequests, setWithdrawalRequests] = useState([]);
//     const [processingWithdrawal, setProcessingWithdrawal] = useState(false);
//     const [showPaymentModal, setShowPaymentModal] = useState(false);
//     const [selectedRequest, setSelectedRequest] = useState(null);

//     useEffect(() => {
//         fetchUsers();
//         fetchWithdrawalRequests();
//     }, []);

//     const fetchWithdrawalRequests = async () => {
//         try {
//             const response = await getAllWithdrawalRequests();
//             if (response.data.success) {
//                 setWithdrawalRequests(response.data.requests);
//             }
//         } catch (error) {
//             console.error('Error fetching withdrawal requests:', error);
//             setError('Failed to load withdrawal requests');
//         }
//     };

//     const fetchUsers = async () => {
//         try {
//             const response = await getAllUsers();
//             if (response.data.success) {
//                 setUsers(response.data.users);
//             }
//         } catch (error) {
//             console.error('Error fetching users:', error);
//             setError('Failed to load users');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleUserClick = async (userId) => {
//         try {
//             const response = await getUserDetails(userId);
//             if (response.data.success) {
//                 setSelectedUser(response.data.user);
//                 setEditedTokenBalance(response.data.user.tokenBalance);
//                 setEditMode(false);
//                 setIsModalOpen(true);
//             }
//         } catch (error) {
//             console.error('Error fetching user details:', error);
//             setError('Failed to load user details');
//         }
//     };

//     const handleWithdrawalProcess = async (requestId, status) => {
//         setProcessingWithdrawal(true);
//         try {
//             const response = await processWithdrawalRequest(requestId, status);
//             if (response.data.success) {
//                 setUpdateMessage(`Withdrawal request ${status} successfully`);
//                 await Promise.all([
//                     fetchWithdrawalRequests(),
//                     fetchUsers()
//                 ]);
//                 setShowPaymentModal(false);
//                 setSelectedRequest(null);
//             }
//         } catch (error) {
//             setUpdateMessage(error.response?.data?.message || `Failed to ${status} withdrawal request`);
//         } finally {
//             setProcessingWithdrawal(false);
//             setTimeout(() => setUpdateMessage(''), 3000);
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await editUser(selectedUser._id, {
//                 tokenBalance: Number(editedTokenBalance)
//             });

//             if (response.data.success) {
//                 setUpdateMessage('Token balance updated successfully!');
//                 setSelectedUser(response.data.user);
//                 setEditMode(false);
//                 fetchUsers();
//                 setTimeout(() => setUpdateMessage(''), 3000);
//             }
//         } catch (error) {
//             setUpdateMessage(error.response?.data?.message || 'Failed to update token balance');
//             setTimeout(() => setUpdateMessage(''), 3000);
//         }
//     };

//     if (loading) return <div className="loading">Loading...</div>;
//     if (error) return <div className="error">{error}</div>;

//     return (
//         <div className="admin-dashboard">
//             <h1>Admin Dashboard</h1>
            
//             {/* Withdrawal Requests Section */}
//             <div className="withdrawal-requests-section">
//                 <h2>Pending Withdrawal Requests</h2>
//                 <div className="withdrawal-requests-list">
//                     {withdrawalRequests
//                         .filter(request => request.status === 'pending')
//                         .map((request) => (
//                             <div key={request._id} className="withdrawal-request-card">
//                                 <div className="request-info">
//                                     <p><strong>User:</strong> {request.user.name}</p>
//                                     <p><strong>Amount:</strong> {request.amount} tokens</p>
//                                     <p><strong>Requested:</strong> {new Date(request.requestDate).toLocaleDateString()}</p>
//                                 </div>
//                                 <div className="request-actions">
//                                     <button
//                                         onClick={() => {
//                                             setSelectedRequest(request);
//                                             setShowPaymentModal(true);
//                                         }}
//                                         disabled={processingWithdrawal}
//                                         className="pay-btn"
//                                     >
//                                         Pay
//                                     </button>
//                                 </div>
//                             </div>
//                         ))}
//                 </div>
//             </div>

//             {/* Users List Section */}
//             <div className="users-list">
//                 <h2>Investors List</h2>
//                 <table className="users-table">
//                     <thead>
//                         <tr>
//                             <th>User ID</th>
//                             <th>Name</th>
//                             <th>Email</th>
//                             <th>Phone</th>
//                             <th>Token Balance</th>
//                             <th>Action</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {users.map((user) => (
//                             <tr key={user._id}>
//                                 <td>{user.userId}</td>
//                                 <td>{user.name}</td>
//                                 <td>{user.email}</td>
//                                 <td>{user.phone}</td>
//                                 <td>{user.tokenBalance}</td>
//                                 <td className="action-buttons">
//                                     <button
//                                         onClick={() => handleUserClick(user._id)}
//                                         className="view-details-btn"
//                                     >
//                                         View Details
//                                     </button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>

//             {/* Modals */}
//             {showPaymentModal && selectedRequest && (
//                 <PaymentModal
//                     request={selectedRequest}
//                     onClose={() => {
//                         setShowPaymentModal(false);
//                         setSelectedRequest(null);
//                     }}
//                     onProcess={handleWithdrawalProcess}
//                 />
//             )}

//             {isModalOpen && selectedUser && (
//                 <UserDetailsModal
//                     user={selectedUser}
//                     onClose={() => {
//                         setIsModalOpen(false);
//                         setSelectedUser(null);
//                         setEditMode(false);
//                         setUpdateMessage('');
//                     }}
//                     onEdit={setEditMode}
//                     editMode={editMode}
//                     editedTokenBalance={editedTokenBalance}
//                     setEditedTokenBalance={setEditedTokenBalance}
//                     handleSubmit={handleSubmit}
//                     updateMessage={updateMessage}
//                 />
//             )}
//         </div>
//     );
// };

// export default AdminDashboard;

import React, { useState, useEffect } from 'react';
import { getAllUsers, getUserDetails, editUser } from '../../../../api/admin';
import { getAllWithdrawalRequests, processWithdrawalRequest } from '../../../../api/withdrawal';
import { getPendingReferralRewards, approveReferralReward, rejectReferralReward } from '../../../../api/referral';
import './AdminDashboard.css';

const PaymentModal = ({ request, onClose, onProcess }) => {
    if (!request || !request.user) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Process Payment</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>
                
                <div className="payment-details">
                    <div className="detail-group">
                        <label>Name:</label>
                        <p>{request.user.name}</p>
                    </div>
                    <div className="detail-group">
                        <label>Email:</label>
                        <p>{request.user.email}</p>
                    </div>
                    <div className="detail-group">
                        <label>Amount:</label>
                        <p>{request.amount} tokens</p>
                    </div>
                    <div className="detail-group">
                        <label>Payment Link:</label>
                        <p className="payment-link">
                            <a href={request.link} target="_blank" rel="noopener noreferrer">
                                {request.link}
                            </a>
                        </p>
                    </div>
                </div>

                <div className="modal-actions">
                    <button
                        onClick={() => onProcess(request._id, 'approved')}
                        className="approve-btn"
                    >
                        Approve
                    </button>
                    <button
                        onClick={() => onProcess(request._id, 'rejected')}
                        className="reject-btn"
                    >
                        Reject
                    </button>
                </div>
            </div>
        </div>
    );
};

const ReferralRewardModal = ({ reward, onClose, onProcess, users }) => {
    if (!reward) return null;

    const referrer = users.find(user => user?.userId === reward.referrer);
    const referee = users.find(user => user?.userId === reward.referee);

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Process Referral Reward</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>
                
                <div className="referral-details">
                    <h3>Reward Details</h3>
                    <div className="detail-group">
                        <label>Referrer:</label>
                        <p>{referrer ? `${referrer.name} (${referrer.userId})` : reward.referrer}</p>
                    </div>
                    <div className="detail-group">
                        <label>Referee:</label>
                        <p>{referee ? `${referee.name} (${referee.userId})` : reward.referee}</p>
                    </div>
                    <div className="detail-group">
                        <label>Reward Amount:</label>
                        <p>{reward.amount} tokens</p>
                    </div>
                    <div className="detail-group">
                        <label>Created Date:</label>
                        <p>{new Date(reward.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>

                <div className="modal-actions">
                    <button
                        onClick={() => onProcess(reward._id, 'approved')}
                        className="approve-btn"
                    >
                        Approve
                    </button>
                    <button
                        onClick={() => onProcess(reward._id, 'rejected')}
                        className="reject-btn"
                    >
                        Reject
                    </button>
                </div>
            </div>
        </div>
    );
};

const UserDetailsModal = ({ 
    user, 
    onClose, 
    onEdit, 
    editMode, 
    editedTokenBalance, 
    setEditedTokenBalance, 
    handleSubmit, 
    updateMessage 
}) => {
    if (!user) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>User Details</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>
                
                {updateMessage && (
                    <div className={`update-message ${updateMessage.includes('successfully') ? 'success' : 'error'}`}>
                        {updateMessage}
                    </div>
                )}

                {editMode ? (
                    <form onSubmit={handleSubmit} className="edit-form">
                        <div className="form-group">
                            <label>User ID:</label>
                            <p>{user.userId}</p>
                        </div>
                        <div className="form-group">
                            <label>Name:</label>
                            <p>{user.name}</p>
                        </div>
                        <div className="form-group">
                            <label>Email:</label>
                            <p>{user.email}</p>
                        </div>
                        <div className="form-group">
                            <label>Phone:</label>
                            <p>{user.phone}</p>
                        </div>
                        <div className="form-group">
                            <label>Token Balance:</label>
                            <input
                                type="number"
                                value={editedTokenBalance}
                                onChange={(e) => setEditedTokenBalance(e.target.value)}
                                step="0.01"
                                min="0"
                                required
                            />
                        </div>
                        <div className="form-buttons">
                            <button type="submit" className="save-btn">Save</button>
                            <button 
                                type="button" 
                                onClick={() => {
                                    onEdit(false);
                                    setEditedTokenBalance(user.tokenBalance);
                                }}
                                className="cancel-btn"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="user-info">
                        <p><strong>User ID:</strong> {user.userId}</p>
                        <p><strong>Name:</strong> {user.name}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Phone:</strong> {user.phone}</p>
                        <p><strong>Role:</strong> {user.role}</p>
                        <p><strong>Token Balance:</strong> {user.tokenBalance}</p>
                        {user.referredBy && <p><strong>Referred By:</strong> {user.referredBy}</p>}
                        <button onClick={() => onEdit(true)} className="edit-btn">
                            Edit Token Balance
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export const AdminDashboard = () => {
    // State management
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [editedTokenBalance, setEditedTokenBalance] = useState('');
    const [updateMessage, setUpdateMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [withdrawalRequests, setWithdrawalRequests] = useState([]);
    const [processingWithdrawal, setProcessingWithdrawal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [referralRewards, setReferralRewards] = useState([]);
    const [processingReferral, setProcessingReferral] = useState(false);
    const [showReferralModal, setShowReferralModal] = useState(false);
    const [selectedReferral, setSelectedReferral] = useState(null);

    // Data fetching effects
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoading(true);
                await Promise.all([
                    fetchUsers(),
                    fetchWithdrawalRequests(),
                    fetchReferralRewards()
                ]);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                setError('Failed to load dashboard data. Please refresh the page.');
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    // Data fetching functions
    const fetchUsers = async () => {
        try {
            const response = await getAllUsers();
            if (response.data.success) {
                setUsers(response.data.users.filter(Boolean));
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    };

    const fetchWithdrawalRequests = async () => {
        try {
            const response = await getAllWithdrawalRequests();
            if (response.data.success) {
                setWithdrawalRequests(response.data.requests.filter(request => request && request.user));
            }
        } catch (error) {
            console.error('Error fetching withdrawal requests:', error);
            throw error;
        }
    };

    const fetchReferralRewards = async () => {
        try {
            const response = await getPendingReferralRewards();
            if (response.data.success) {
                setReferralRewards(response.data.rewards.filter(Boolean));
            }
        } catch (error) {
            console.error('Error fetching referral rewards:', error);
            throw error;
        }
    };

    // Event handlers
    const handleUserClick = async (userId) => {
        try {
            const response = await getUserDetails(userId);
            if (response.data.success) {
                setSelectedUser(response.data.user);
                setEditedTokenBalance(response.data.user.tokenBalance);
                setEditMode(false);
                setIsModalOpen(true);
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
            setError('Failed to load user details');
        }
    };

    const handleWithdrawalProcess = async (requestId, status) => {
        setProcessingWithdrawal(true);
        try {
            const response = await processWithdrawalRequest(requestId, status);
            if (response.data.success) {
                setUpdateMessage(`Withdrawal request ${status} successfully`);
                await Promise.all([
                    fetchWithdrawalRequests(),
                    fetchUsers()
                ]);
                setShowPaymentModal(false);
                setSelectedRequest(null);
            }
        } catch (error) {
            setUpdateMessage(error.response?.data?.message || `Failed to ${status} withdrawal request`);
        } finally {
            setProcessingWithdrawal(false);
            setTimeout(() => setUpdateMessage(''), 3000);
        }
    };

    const handleReferralProcess = async (rewardId, status) => {
        setProcessingReferral(true);
        try {
            const response = status === 'approved' 
                ? await approveReferralReward(rewardId)
                : await rejectReferralReward(rewardId);

            if (response.data.success) {
                setUpdateMessage(`Referral reward ${status} successfully`);
                await Promise.all([
                    fetchReferralRewards(),
                    fetchUsers()
                ]);
                setShowReferralModal(false);
                setSelectedReferral(null);
            }
        } catch (error) {
            setUpdateMessage(error.response?.data?.message || `Failed to ${status} referral reward`);
        } finally {
            setProcessingReferral(false);
            setTimeout(() => setUpdateMessage(''), 3000);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await editUser(selectedUser._id, {
                tokenBalance: Number(editedTokenBalance)
            });

            if (response.data.success) {
                setUpdateMessage('Token balance updated successfully!');
                setSelectedUser(response.data.user);
                setEditMode(false);
                await fetchUsers();
            }
        } catch (error) {
            setUpdateMessage(error.response?.data?.message || 'Failed to update token balance');
        } finally {
            setTimeout(() => setUpdateMessage(''), 3000);
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>
            
            {/* Referral Rewards Section */}
            <div className="referral-rewards-section">
                <h2>Pending Referral Rewards</h2>
                <div className="referral-rewards-list">
                    {referralRewards
                        .filter(reward => reward.status === 'pending')
                        .map((reward) => (
                            <div key={reward._id} className="referral-reward-card">
                                <div className="reward-info">
                                    <p><strong>Referrer ID:</strong> {reward.referrer}</p>
                                    <p><strong>New User ID:</strong> {reward.referee}</p>
                                    <p><strong>Reward Amount:</strong> {reward.amount} tokens</p>
                                    <p><strong>Created:</strong> {new Date(reward.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="reward-actions">
                                    <button
                                        onClick={() => {
                                            setSelectedReferral(reward);
                                            setShowReferralModal(true);
                                        }}
                                        disabled={processingReferral}
                                        className="process-btn"
                                    >
                                        Process Reward
                                    </button>
                                </div>
                            </div>
                        ))}
                    {referralRewards.filter(reward => reward.status === 'pending').length === 0 && (
                        <p className="no-items-message">No pending referral rewards</p>
                    )}
                </div>
            </div>

            {/* Withdrawal Requests Section */}
            <div className="withdrawal-requests-section">
                <h2>Pending Withdrawal Requests</h2>
                <div className="withdrawal-requests-list">
                    {withdrawalRequests
                        .filter(request => request.status === 'pending')
                        .map((request) => (
                            <div key={request._id} className="withdrawal-request-card">
                                <div className="request-info">
                                    <p><strong>User:</strong> {request.user?.name || 'Unknown User'}</p>
                                    <p><strong>Amount:</strong> {request.amount} tokens</p>
                                    <p><strong>Requested:</strong> {new Date(request.requestDate).toLocaleDateString()}</p>
                                </div>
                                <div className="request-actions">
                                    <button
                                        onClick={() => {
                                            setSelectedRequest(request);
                                            setShowPaymentModal(true);
                                        }}
                                        disabled={processingWithdrawal || !request.user}
                                        className="pay-btn"
                                    >
                                        Pay
                                    </button>
                                </div>
                            </div>
                        ))}
                    {withdrawalRequests.filter(request => request.status === 'pending').length === 0 && (
                        <p className="no-items-message">No pending withdrawal requests</p>
                    )}
                </div>
            </div>

            {/* Users List Section */}
            <div className="users-list">
                <h2>Investors List</h2>
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>User ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Token Balance</th>
                            <th>Referred By</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => user && (
                            <tr key={user._id}>
                                <td>{user.userId}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.phone}</td>
                                <td>{user.tokenBalance}</td>
                                <td>{user.referredBy || '-'}</td>
                                <td className="action-buttons">
                                    <button
                                        onClick={() => handleUserClick(user._id)}
                                        className="view-details-btn"
                                    >
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modals */}
            {showPaymentModal && selectedRequest && selectedRequest.user && (
                <PaymentModal
                    request={selectedRequest}
                    onClose={() => {
                        setShowPaymentModal(false);
                        setSelectedRequest(null);
                    }}
                    onProcess={handleWithdrawalProcess}
                />
            )}

            {showReferralModal && selectedReferral && (
                <ReferralRewardModal
                    reward={selectedReferral}
                    users={users}
                    onClose={() => {
                        setShowReferralModal(false);
                        setSelectedReferral(null);
                    }}
                    onProcess={handleReferralProcess}
                />
            )}

            {isModalOpen && selectedUser && (
                <UserDetailsModal
                    user={selectedUser}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedUser(null);
                        setEditMode(false);
                        setUpdateMessage('');
                    }}
                    onEdit={setEditMode}
                    editMode={editMode}
                    editedTokenBalance={editedTokenBalance}
                    setEditedTokenBalance={setEditedTokenBalance}
                    handleSubmit={handleSubmit}
                    updateMessage={updateMessage}
                />
            )}
        </div>
    );
};