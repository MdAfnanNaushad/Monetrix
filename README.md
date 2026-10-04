# Monetrix — Intelligent Financial Management Platform

A high-performance personal finance tracking and wealth intelligence platform built with modern architecture, real-time analytics, and clean fintech UX.

---

## Architecture Overview

```
Monetrix/
├── server/                     # Backend API Microservice
│   ├── config/connectDb.js     # MongoDB Database Connection
│   ├── controllers/            # User & Transaction Business Logic
│   ├── middlewares/            # JWT Authentication Middleware
│   ├── models/                 # Mongoose Schemas (User, Transaction)
│   ├── routes/                 # Express REST Endpoints
│   └── server.js               # Express Server Entry Point (Port 3003)
├── client/                     # Frontend Application (Vite + React + Tailwind CSS)
│   ├── index.html              # Vite SPA Entry Point
│   ├── vite.config.js          # Vite Bundler & Reverse Proxy
│   ├── tailwind.config.js      # Custom Emerald & Slate Fintech Theme & Dark Mode
│   ├── src/
│   │   ├── components/         # Analytics, Spinner, Header, Footer, Layout
│   │   ├── context/            # ThemeContext (Light/Dark) & ToastContext
│   │   ├── pages/              # HomePage, Login, Register
│   │   └── App.jsx             # Protected & Public Routing
└── package.json                # Root Orchestration Scripts
```

---

## Features & Improvements

- **Modern Fintech UI/UX**: Designed with crisp emerald and slate accents, elegant glassmorphic cards, and zero Ant Design bloat.
- **Persistent Light & Dark Mode**: Seamless toggle with system color scheme detection and localStorage persistence.
- **Fast Vite Engine**: Migrated from slow Create React App (CRA) to instant Vite HMR and optimized production bundling.
- **Financial Intelligence Dashboard**:
  - Net margin, inflow vs. outflow velocity tracking, and category-level expense/income drilldowns.
  - Interactive frequency selection (7 days, 30 days, quarter, 1 year, custom date ranges).
  - Search filtering by description and category.
  - One-click CSV transaction history export.
  - Micro-animations and celebration feedback for income entries.
- **Polished Authentication**:
  - Modern sign-in and registration pages with inline validation, password confirmation, and secure JWT handling.
- **Organized Backend Structure**:
  - All backend modules cleanly contained in [`server/`](file:///server/) directory.
  - Root scripts updated so `npm run dev`, `npm run server`, `npm run client`, and `npm start` work out of the box.

---

## Quickstart

### 1. Install Dependencies
```bash
npm install
npm --prefix client install
```

### 2. Environment Setup
Create a `.env` in the root directory:
```env
PORT=3003
MONGO_URL=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
```

### 3. Run Development Servers
Runs both Express backend (Port 3003) and Vite frontend (Port 3000) simultaneously:
```bash
npm run dev
```

Or run individually:
```bash
npm run server   # Starts Express backend with nodemon
npm run client   # Starts Vite React frontend
```

### 4. Production Build
```bash
npm run build    # Builds Vite frontend into client/dist
npm start        # Starts Express server serving the production bundle
```
