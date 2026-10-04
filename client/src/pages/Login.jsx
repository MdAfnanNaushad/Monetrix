import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';
import {
  Lock,
  Mail,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Sun,
  Moon,
  Sparkles,
  CheckCircle,
  BarChart3,
  DollarSign,
  PieChart,
  Activity,
  Layers,
} from 'lucide-react';
import CountUp from '../components/CountUp';

const Login = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { theme, toggleTheme } = useTheme();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error('Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);
      const API_URL = import.meta.env.VITE_API_URL || '/api/v1';
      const res = await axios.post(`${API_URL}/users/login`, formData, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.status === 200 && res.data.token) {
        toast.success('Welcome back to Monetrix!');
        localStorage.setItem('token', res.data.token);
        if (res.data.user) {
          localStorage.setItem('user', JSON.stringify(res.data.user));
        } else {
          localStorage.setItem('user', JSON.stringify({ email: formData.email, name: formData.email.split('@')[0] }));
        }
        navigate('/', { replace: true });
      } else {
        throw new Error('Login failed. Please check credentials.');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-slate-50 dark:bg-[#070b12] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* LEFT SPLIT: Hero Visual Showcase with Framer Motion */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-between bg-slate-900 text-white relative overflow-hidden"
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between z-10">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-emerald-600 flex items-center justify-center p-1.5 shadow-md">
              <img
                src="/freepik-modern-linear-money-care-accounting-logo-202503081042289XZP.png"
                alt="Monetrix"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-white">Monetrix</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Finance OS</span>
            </div>
          </Link>
          <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-slate-800 border border-slate-700 text-xs font-semibold text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>v2.0 Enterprise Engine</span>
          </div>
        </div>

        {/* Centerpiece Visual Dashboard Preview Card */}
        <div className="my-12 z-10 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              Master Your Money with Real-Time Precision.
            </h1>
            <p className="mt-4 text-base text-slate-300 max-w-lg">
              Next-generation financial operating platform engineered to track expenditures, detect margin anomalies, and empower intentional wealth growth.
            </p>
          </motion.div>

          {/* Interactive Metric Showcase Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="p-5 rounded-md bg-slate-800 border border-slate-700 shadow-md space-y-2"
            >
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase">
                <span>Annual Cashflow Tracked</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-white font-mono">
                <CountUp end={842500} prefix="$" decimals={0} />
              </div>
              <p className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> 99.98% Accuracy
              </p>
            </motion.div>

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.45, duration: 0.5 }}
              className="p-5 rounded-md bg-slate-800 border border-slate-700 shadow-md space-y-2"
            >
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase">
                <span>Average Savings Velocity</span>
                <Activity className="w-4 h-4 text-teal-400" />
              </div>
              <div className="text-2xl font-black text-white font-mono">
                <CountUp end={34.8} suffix="%" decimals={1} />
              </div>
              <p className="text-xs text-teal-300 font-medium flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Optimizing Margins
              </p>
            </motion.div>
          </div>

          {/* Bullet points */}
          <div className="space-y-2.5 pt-2 text-sm text-slate-300">
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-md bg-emerald-600/30 text-emerald-400 flex items-center justify-center">
                <CheckCircle className="w-3.5 h-3.5" />
              </div>
              <span>Live Recharts visualization across custom date frequencies</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-md bg-emerald-600/30 text-emerald-400 flex items-center justify-center">
                <CheckCircle className="w-3.5 h-3.5" />
              </div>
              <span>Instant single-click CSV export for accounting & taxation</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-md bg-emerald-600/30 text-emerald-400 flex items-center justify-center">
                <CheckCircle className="w-3.5 h-3.5" />
              </div>
              <span>Bank-level 256-bit secure tokenized authorization</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="z-10 flex items-center justify-between text-xs text-slate-400 pt-6 border-t border-slate-800">
          <span>&copy; {new Date().getFullYear()} Monetrix Platform</span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Certified Secure
          </span>
        </div>
      </motion.div>

      {/* RIGHT SPLIT: Login Form with Theme Switcher */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="lg:w-1/2 p-8 sm:p-12 lg:p-20 flex flex-col justify-center items-center relative"
      >
        {/* Top Right Controls */}
        <div className="absolute top-6 right-6">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-sm"
            title="Toggle Light/Dark Mode"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
          </button>
        </div>

        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Sign into your account
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Enter your credentials to access your financial dashboard
            </p>
          </div>

          <form className="space-y-5" onSubmit={submitHandler}>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  className="block w-full pl-11 pr-4 py-3 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 dark:text-white placeholder-slate-400 transition-colors shadow-sm"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••••••"
                  className="block w-full pl-11 pr-4 py-3 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 dark:text-white placeholder-slate-400 transition-colors shadow-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-md text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md active:scale-[0.99] transition-all disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                  Signing in...
                </span>
              ) : (
                <>
                  <span>Sign into Monetrix</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 text-center text-sm border-t border-slate-200 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400">Don't have an account? </span>
            <Link
              to="/register"
              className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline transition-colors"
            >
              Create free account
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
