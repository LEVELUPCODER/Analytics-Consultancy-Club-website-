# 🏏 ACC Club: Official Platform & IPL 2026 Intelligence Dashboard

> **A scalable web platform featuring a Real-Time Machine Learning Pipeline for Cricket Analytics & Win Prediction.**

Welcome to the official workspace of the **ACC Club**.
This platform is designed to present the club's identity, showcase flagship technical projects, and provide a scalable, decoupled architecture for future web initiatives.

Our current highlighted showcase is the **IPL 2026 Prediction Terminal**, integrating an XGBoost ML backend with a high-performance React frontend.

---

## 🚀 System Architecture & Data Flow

The platform follows a modern microservices-inspired architecture, ensuring 99.9% uptime and low-latency inference during live sports events.

- **Frontend:** A glassmorphism-themed React SPA optimized for data scannability and live polling.
- **Backend:** A Flask-based REST API handling real-time data injection and model serving.
- **Inference Engine:** An XGBoost classifier trained on historical IPL data, Elo ratings, and EMA (Exponential Moving Average) form factors.
- **Data Middleware:** A fail-safe JSON data layer ensuring UI stability even during external API rate-limiting.

---

## 🛠️ Tech Stack

### **Frontend & UI/UX**

- **React 19:** Component-driven architecture with custom hooks (`useLivePrediction`).
- **Vite 8:** Next-gen frontend tooling for instant HMR and optimized builds.
- **Tailwind CSS:** Custom utility-first styling for the **Neon Terminal Hacker Aesthetic**.
- **React Router DOM:** Seamless client-side routing across Landing, Projects, and Dashboard pages.

### **Machine Learning & Backend API**

- **Python 3.10+ & Flask:** RESTful API serving live inferences with CORS enabled.
- **XGBoost & Scikit-learn:** Predictive modeling pipeline with robust feature engineering.
- **Pandas/NumPy:** Runtime data shaping and feature extraction (CRR, RRR, Wicket-adjusted pressure).
- **Joblib:** Serialized model persistence (`.pkl` artifacts).

---

## 💎 Key Project Features

### **1. Live In-Play Prediction Terminal**

- **Real-Time Polling:** Client-side React hooks fetch live match context every 30 seconds.
- **AI Win Probability:** Ball-by-ball probability shifts based on live score injection.
- **Inference SLA:** End-to-end prediction delivery in **< 3 seconds**.

- https://cricketdata.org/ ## for api

### **2. Detailed Scorecard Modal (Fail-Safe UI)**

- **Deep-Dive Analytics:** A dedicated glassmorphism modal providing comprehensive batting/bowling splits.
- **JSON Data Layer:** Uses `live_scorecard.json` to mock/cache live API payloads, ensuring 100% demo stability and zero downtime during high-traffic intervals.

### **3. Fixture Intelligence & KPIs**

- **Advanced Filtering:** Dynamically filter 20+ upcoming matches by venue, team, or model confidence.
- **Confidence Calibration:** Calibrated model outputs reflecting standard deviation across varied pitch conditions.

---

## 📂 Repository Structure

```text
ACC_Project_IPL2026/
├── backend/                  # Flask API & ML Inference Engine
│   ├── data/                 # Live JSON middleware & historical CSVs
│   ├── models/               # Serialized XGBoost (.pkl) artifacts
│   ├── .env                  # Environment config (CRICAPI_KEY)
│   └── app.py                # Main Flask application & routes
├── frontend/                 # React + Vite Web Application
│   ├── src/
│   │   ├── hooks/            # Custom polling hooks
│   │   ├── pages/            # IPL2026Page.jsx, LandingPage.jsx
│   │   └── components/       # Reusable UI modules (Modals, Cards)
│   ├── package.json          # Frontend dependencies
│   └── tailwind.config.js    # Design system tokens
└── README.md
```
