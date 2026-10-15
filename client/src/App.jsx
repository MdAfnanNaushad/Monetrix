import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import LottieAnimation from './components/LottieAnimation';
import loadingAnimation from './components/loading.json';
import HomePage from './pages/HomePage';
import Register from './pages/Register';
import Login from './pages/Login';

export function ProtectedRoutes({ children }) {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export function PublicRoute({ children }) {
  const token = localStorage.getItem('token');
  if (token) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function App() {
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 1000); // 1 second loading screen on initial refresh / load

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {initialLoading && (
          <motion.div
            key="splash-loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.35, ease: 'easeInOut' } }}
            className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#070b12] text-white selection:bg-emerald-500"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 mb-2 flex items-center justify-center">
              <img
                src="/monetrix-logo.png"
                alt="Monetrix Logo"
                className="w-full h-full object-contain filter drop-shadow-[0_4px_16px_rgba(52,211,153,0.5)]"
              />
            </div>
            <div className="w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
              <LottieAnimation animationData={loadingAnimation} loop={true} autoplay={true} />
            </div>
            <div className="flex flex-col items-center gap-1 mt-2">
              <span className="text-sm font-extrabold tracking-wider uppercase text-white font-sans">
                Monetrix
              </span>
              <span className="text-xs text-[#00a8f2] font-semibold tracking-wide">
                Finance in Focus
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoutes>
              <HomePage />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
