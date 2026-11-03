# Secure Pay: AI-Powered UPI Fraud Detection System

Secure Pay is a full-stack web application designed to simulate a modern UPI payment platform with advanced, real-time machine learning fraud detection built directly into its core.

## 🚀 Features
*   **Real-time AI Fraud Detection:** Uses pre-trained Machine Learning models (Random Forest / XGBoost) via Scikit-Learn to evaluate transactions as they happen.
*   **Predictive Risk Scoring:** Transactions are assigned a **LOW**, **MEDIUM**, or **HIGH** risk level depending on factors like velocity, geographic location, account history, and transaction amounts.
*   **Full Admin Dashboard:** A dedicated portal for administrators to review high-risk flags across the platform, manage users, and resolve support tickets.
*   **Support Ticketing System:** Dedicated support platform where users can raise issues, and administrators can read and respond to them directly from their panel.
*   **"Testing Playground" Sandbox:** Integrated cheat sheets so new testers can instantly trigger different types of fraud scenarios securely.

## 💻 Tech Stack
*   **Frontend:** React, Vite, Tailwind CSS (Modern, responsive UI)
*   **Backend:** Python, FastAPI, Uvicorn, JWT Authentication (Fast, async logic processing)
*   **Database:** MongoDB Atlas / PyMongo (NoSQL flexibility for transactions and user data)
*   **Machine Learning:** Scikit-Learn, XGBoost, Pandas, NumPy, Joblib (Model training & data processing)

## 🛠 Installation & Setup Guide
Make sure you have Node.js, Python 3.10+, and MongoDB installed and running on your system.

### 1. Database & Backend Setup
Open a terminal and navigate to the backend folder:
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Train the AI Model & Seed Data:
```bash
python train_model.py
python seed_data.py
```

Start the Backend Server (FastAPI):
```bash
uvicorn main:app --reload --port 8000
```
*(The backend API will run on http://localhost:8000)*

### 2. Frontend Setup
Open a **new** terminal and navigate to the frontend folder:
```bash
cd frontend
npm install
npm run dev
```
*(The frontend React app will run on http://localhost:5173)*

## 🔑 Default Sandbox Credentials
The `seed_data.py` script automatically generates robust test users for you to explore the application without doing manual setup.

**Admin Portal Access**
*   Username: `admin`
*   Password: `password`

**Basic User Accounts (Low Risk)**
*   Username: `gooduser1` to `gooduser18`
*   Password: `password123`

**Simulated Fraud Accounts (High Risk)**
*   Velocity Fraudsters: `velocity1` to `velocity6` (spam/rapid transactions)
*   Location Fraudsters: `location1` to `location6` (geographic anomalies)
*   Timing Fraudsters: `timing1` to `timing6` (late-night unexpected behavior)
*   Password (for all): `password123`

## 🧪 Testing the Fraud Engine
Log in as a standard user, go to the **Dashboard**, and attempt to send funds:
1.  **Low Risk:** Send a small amount to `gooduser5@okbank`
2.  **Velocity Warning:** Send money to `velocity1@fraudbank`
3.  **Geo/Location Warning:** Send money to `location3@fraudbank`
4.  **Transaction Limit:** Attempt to send `₹150,000` to trigger a hard block.

---
*Developed for advanced security and ML integration testing.*
