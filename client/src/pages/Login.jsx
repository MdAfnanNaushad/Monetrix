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
      {/* LEFT SPLIT: Hero Visual Showcase with Framer Motion (hidden or compact on mobile, rich on tablet/desktop) */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full lg:w-1/2 p-6 sm:p-10 lg:p-16 flex flex-col justify-between bg-slate-900 text-white relative overflow-hidden"
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between z-10 gap-3">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
              <img
                src="/monetrix-logo.png"
                alt="Monetrix Logo"
                className="w-full h-full object-contain filter drop-shadow-[0_4px_12px_rgba(52,211,153,0.4)]"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white leading-none">Monetrix</span>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#00a8f2] mt-0.5">Finance in Focus</span>
            </div>
          </Link>
        </div>

        {/* Centerpiece Visual Dashboard Preview Card */}
        <div className="my-8 sm:my-10 lg:my-12 z-10 space-y-5 sm:space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white leading-tight">
              Master Your Money with Real-Time Precision.
            </h1>
            <p className="mt-3 sm:mt-4 text-xs sm:text-sm lg:text-base text-slate-300 max-w-lg leading-relaxed font-normal">
              Next-generation financial operating platform engineered to track expenditures, detect margin anomalies, and empower intentional wealth growth.
            </p>
          </motion.div>

          {/* Interactive Metric Showcase Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-2 sm:pt-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.4 }}
              className="p-4 sm:p-5 rounded-md bg-slate-800 border border-slate-700 shadow-md space-y-1.5 sm:space-y-2"
            >
              <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-400 font-semibold uppercase">
                <span>Annual Cashflow</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-white font-mono">
                <CountUp end={842500} prefix="₹" decimals={0} />
              </div>
              <p className="text-[11px] sm:text-xs text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> 99.98% Accuracy
              </p>
            </motion.div>

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.4 }}
              className="p-4 sm:p-5 rounded-md bg-slate-800 border border-slate-700 shadow-md space-y-1.5 sm:space-y-2"
            >
              <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-400 font-semibold uppercase">
                <span>Savings Velocity</span>
                <Activity className="w-4 h-4 text-teal-400" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-white font-mono">
                <CountUp end={34.8} suffix="%" decimals={1} />
              </div>
              <p className="text-[11px] sm:text-xs text-teal-300 font-medium flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Optimizing Margins
              </p>
            </motion.div>
          </div>

          {/* Bullet points - hidden on tiny mobile, visible sm+ */}
          <div className="hidden sm:block space-y-2.5 pt-2 text-xs sm:text-sm text-slate-300">
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-md bg-emerald-600/30 text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle className="w-3.5 h-3.5" />
              </div>
              <span>Live Recharts visualization across custom date frequencies</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-md bg-emerald-600/30 text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle className="w-3.5 h-3.5" />
              </div>
              <span>Instant single-click CSV export for accounting & taxation</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="z-10 flex items-center justify-between text-xs text-slate-400 pt-4 sm:pt-6 border-t border-slate-800">
          <span>&copy; {new Date().getFullYear()} Monetrix</span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Certified Secure
          </span>
        </div>
      </motion.div>

      {/* RIGHT SPLIT: Login Form with Theme Switcher */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full lg:w-1/2 p-6 sm:p-10 lg:p-16 xl:p-20 flex flex-col justify-center items-center relative min-h-[500px] overflow-hidden"
      >
        {/* Background Vibrant Green Watermark Logo Overlay Behind Form */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden">
          <div className="w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] lg:w-[460px] lg:h-[460px] opacity-[0.12] dark:opacity-[0.16] transform translate-x-2 sm:translate-x-6">
            <img
              src="/monetrix-logo.png"
              alt=""
              aria-hidden="true"
              className="w-full h-full object-contain filter drop-shadow-[0_0_25px_rgba(52,211,153,0.35)]"
            />
          </div>
        </div>

        {/* Top Right Theme Control */}
        <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-20">
          <button
            onClick={toggleTheme}
            aria-label="Toggle color theme"
            className="p-2 sm:p-2.5 min-h-[40px] min-w-[40px] flex items-center justify-center rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-sm"
            title="Toggle Light/Dark Mode"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" />}
          </button>
        </div>

        <div className="w-full max-w-md space-y-6 sm:space-y-8 my-auto relative z-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Sign into your account
            </h2>
            <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Enter your credentials to access your financial dashboard
            </p>
          </div>

          <form className="space-y-4 sm:space-y-5" onSubmit={submitHandler}>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  className="block w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 dark:text-white placeholder-slate-400 transition-colors shadow-sm"
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
                  <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••••••"
                  className="block w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 dark:text-white placeholder-slate-400 transition-colors shadow-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full min-h-[44px] sm:min-h-[48px] flex items-center justify-center gap-2 py-3 sm:py-3.5 px-4 rounded-md text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md active:scale-[0.99] transition-all disabled:opacity-60"
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

          <div className="pt-3 sm:pt-4 text-center text-xs sm:text-sm border-t border-slate-200 dark:border-slate-800">
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
