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
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-between bg-slate-900 text-white relative overflow-hidden"
      >
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
            <span>Fast Setup in 30 Seconds</span>
          </div>
        </div>

        <div className="my-12 z-10 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              Start Building Financial Freedom Today.
            </h1>
            <p className="mt-4 text-base text-slate-300 max-w-lg">
              Set up your profile, track monthly cashflow, generate custom tax reports, and gain complete visibility over every cent.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="p-5 rounded-md bg-slate-800 border border-slate-700 space-y-1">
              <span className="text-xs uppercase font-bold text-slate-400">Active Households</span>
              <div className="text-2xl font-black text-white font-mono">
                <CountUp end={14200} prefix="+" decimals={0} />
              </div>
              <p className="text-xs text-emerald-400">Growing weekly</p>
            </div>
            <div className="p-5 rounded-md bg-slate-800 border border-slate-700 space-y-1">
              <span className="text-xs uppercase font-bold text-slate-400">Data Encryption</span>
              <div className="text-2xl font-black text-white font-mono">256-Bit</div>
              <p className="text-xs text-teal-400">Bank-grade protection</p>
            </div>
          </div>
        </div>

        <div className="z-10 flex items-center justify-between text-xs text-slate-400 pt-6 border-t border-slate-800">
          <span>Monetrix Finance Engine</span>
          <span>Zero Subscription Fees Required</span>
        </div>
      </motion.div>

      {/* RIGHT SPLIT: Registration Form */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="lg:w-1/2 p-8 sm:p-12 lg:p-20 flex flex-col justify-center items-center relative"
      >
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
              Create your account
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Start managing your expenses and income in seconds
            </p>
          </div>

          <form className="space-y-4" onSubmit={submitHandler}>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="block w-full pl-11 pr-4 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white placeholder-slate-400 shadow-sm"
                />
              </div>
            </div>

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
                  className="block w-full pl-11 pr-4 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white placeholder-slate-400 shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Password
              </label>
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
                  placeholder="At least 6 characters"
                  className="block w-full pl-11 pr-4 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white placeholder-slate-400 shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat your password"
                  className="block w-full pl-11 pr-4 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white placeholder-slate-400 shadow-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-md text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md active:scale-[0.99] transition-all disabled:opacity-60"
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

          <div className="pt-4 text-center text-sm border-t border-slate-200 dark:border-slate-800">
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
