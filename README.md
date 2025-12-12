# Crypto Dashboard Application

## Overview
This is a full-stack MERN (MongoDB, Express, React, Node.js) application for a crypto investment platform. It features user authentication, a daily mining mechanism, a deposit/withdrawal system, and a referral program with commission bonuses.

## Features

### 1. User Features
*   **Registration & Login**: Secure authentication with JWT. Users are assigned a unique **User ID** which also serves as their **Referral Code**.
*   **Dashboard**:
    *   **View Balance**: See current token balance and pending tokens.
    *   **Daily Mining**: Users can click "MINE" once every 24 hours to earn **1%** of their *available* balance (Total Balance - Pending Withdrawals).
    *   **Add Tokens (Deposit)**: Users can request to add tokens by submitting a transaction ID/proof.
    *   **Withdraw Tokens**: Users can request withdrawals. This locks the amount until approved or rejected by an admin.
    *   **Watch & Earn**: Users can watch featured YouTube videos to earn instant token rewards.
*   **Referral System**: Users can refer others using their User ID.

### 2. Admin Features
*   **Admin Dashboard**:
    *   **Manage Users**: View all users, their balances, and details.
    *   **Give Balance**: Directly add tokens to any user's account.
    *   **Process Deposits**: Approve or reject user deposit requests.
    *   **Process Withdrawals**: Approve or reject user withdrawal requests.
    *   **Site Settings**:
        *   **Dashboard Images**: Upload/link up to 4 images that will cycle on the user dashboard.
        *   **Video Tasks**: Add YouTube video links and set reward amounts for users to earn.
    *   **Referral Rewards**: Manage standard referral rewards (if applicable).

## Key Workflows

### A. Deposit & Referral Bonus Flow (The 10% Logic)
1.  **User A** refers **User B**.
2.  **User B** signs up using User A's code.
3.  **User B** clicks "Add Tokens" on their dashboard.
4.  **User B** enters an amount (e.g., 1000 tokens) and a Transaction ID, then submits.
5.  **Admin** sees the request in "Pending Deposit Requests".
6.  **Admin** clicks **Approve**.
    *   **User B** receives **1000 tokens**.
    *   **System** automatically checks who referred User B.
    *   **User A (Referrer)** instantly receives **10% (100 tokens)** as a bonus.
    *   *Note*: This bonus is minted (new tokens), not deducted from User B's deposit.

### B. Daily Mining Flow
1.  **User** clicks "MINE".
2.  System checks if 24 hours have passed since the last mine.
3.  System calculates **1%** of the user's *current available balance*.
    *   *Example*: Balance 1000, Pending Withdrawal 200 -> Available 800. Reward = 8.
4.  The reward is added to the user's balance.
5.  A 24-hour cooldown timer starts.

### C. Withdrawal Flow
1.  **User** clicks "Withdraw".
2.  User enters amount and payment link (e.g., crypto wallet address).
3.  System checks if user has enough balance and no other active requests.
4.  **Admin** sees the request in "Pending Withdrawal Requests".
5.  **Admin** pays the user externally and clicks **"Pay" (Approve)**.
    *   The amount is permanently deducted from the user's balance.
6.  If **Rejected**, the amount is released back to the user's available balance.

## Setup & Run Instructions

### Prerequisites
*   Node.js installed
*   MongoDB installed and running (or a MongoDB Atlas URI)

### 1. Backend Setup
1.  Navigate to the backend folder:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `backend` folder:
    ```env
    PORT=4000
    MONGODB_URL=your_mongodb_connection_string
    JWT_SECRET=your_secret_key
    FRONTEND_URL=http://localhost:5173
    ```
4.  Start the server:
    ```bash
    npm start
    ```

### 2. Frontend Setup
1.  Navigate to the frontend folder:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `frontend` folder (optional if defaults work):
    ```env
    VITE_API_URL=http://localhost:4000/api
    ```
4.  Start the application:
    ```bash
    npm run dev
    ```

### 3. Usage
*   Open your browser at `http://localhost:5173`.
*   **Admin Access**: To access the admin dashboard, you might need to manually set a user's role to "Admin" in your MongoDB database, or use a pre-configured admin account.

## Directory Structure
*   `backend/`
    *   `Controllers/`: Logic for Auth, Mining, Admin, Withdrawal, Deposit.
    *   `Models/`: Database schemas (User, DepositRequest, etc.).
    *   `Routes/`: API endpoints.
*   `frontend/`
    *   `src/api/`: Axios service files for communicating with backend.
    *   `src/components/pages/`: UI components for Dashboard and Admin.
