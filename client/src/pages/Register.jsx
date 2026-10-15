import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Sun,
  Moon,
  Sparkles,
} from 'lucide-react';
import CountUp from '../components/CountUp';

const Register = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { theme, toggleTheme } = useTheme();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Please enter your full name.');
      return;
    }
    if (!formData.email.trim()) {
      toast.error('Please enter a valid email address.');
      return;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      const API_URL = import.meta.env.VITE_API_URL || '/api/v1';

      const res = await axios.post(
        `${API_URL}/users/register`,
        {
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (res.status === 201) {
        toast.success('Registration successful! Please sign in.');
        navigate('/login');
      } else {
        throw new Error(res.data?.message || 'Registration failed.');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-slate-50 dark:bg-[#070b12] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* LEFT SPLIT: Hero Visual Showcase */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full lg:w-1/2 p-6 sm:p-10 lg:p-16 flex flex-col justify-between bg-slate-900 text-white relative overflow-hidden"
      >
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

        <div className="my-8 sm:my-10 lg:my-12 z-10 space-y-5 sm:space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white leading-tight">
              Start Building Financial Freedom Today.
            </h1>
            <p className="mt-3 sm:mt-4 text-xs sm:text-sm lg:text-base text-slate-300 max-w-lg leading-relaxed font-normal">
              Set up your profile, track monthly cashflow, generate custom tax reports, and gain complete visibility over every cent.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-2 sm:pt-4">
            <div className="p-4 sm:p-5 rounded-md bg-slate-800 border border-slate-700 space-y-1">
              <span className="text-[11px] sm:text-xs uppercase font-bold text-slate-400">Active Households</span>
              <div className="text-xl sm:text-2xl font-black text-white font-mono">
                <CountUp end={14200} prefix="+" decimals={0} />
              </div>
              <p className="text-[11px] sm:text-xs text-emerald-400">Growing weekly</p>
            </div>
            <div className="p-4 sm:p-5 rounded-md bg-slate-800 border border-slate-700 space-y-1">
              <span className="text-[11px] sm:text-xs uppercase font-bold text-slate-400">Data Encryption</span>
              <div className="text-xl sm:text-2xl font-black text-white font-mono">256-Bit</div>
              <p className="text-[11px] sm:text-xs text-teal-400">Bank-grade protection</p>
            </div>
          </div>
        </div>

        <div className="z-10 flex items-center justify-between text-xs text-slate-400 pt-4 sm:pt-6 border-t border-slate-800">
          <span>Monetrix Finance Engine</span>
          <span>Zero Fees Required</span>
        </div>
      </motion.div>

      {/* RIGHT SPLIT: Registration Form */}
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
              Create your account
            </h2>
            <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Start managing your expenses and income in seconds
            </p>
          </div>

          <form className="space-y-3.5 sm:space-y-4" onSubmit={submitHandler}>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="block w-full pl-10 sm:pl-11 pr-4 py-2 sm:py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white placeholder-slate-400 shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
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
                  className="block w-full pl-10 sm:pl-11 pr-4 py-2 sm:py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white placeholder-slate-400 shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Password
              </label>
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
                  placeholder="At least 6 characters"
                  className="block w-full pl-10 sm:pl-11 pr-4 py-2 sm:py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white placeholder-slate-400 shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat your password"
                  className="block w-full pl-10 sm:pl-11 pr-4 py-2 sm:py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white placeholder-slate-400 shadow-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full min-h-[44px] sm:min-h-[48px] flex items-center justify-center gap-2 py-2.5 sm:py-3 px-4 rounded-md text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md active:scale-[0.99] transition-all disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                  Creating Account...
                </span>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-3 sm:pt-4 text-center text-xs sm:text-sm border-t border-slate-200 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400">Already have an account? </span>
            <Link
              to="/login"
              className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline transition-colors"
            >
              Sign in here
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
