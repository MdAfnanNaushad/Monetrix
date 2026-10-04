import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import {
  Sun,
  Moon,
  LogOut,
  Wallet,
  Menu,
  X,
  User,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const toast = useToast();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getUser = () => {
    try {
      const raw = localStorage.getItem('user');
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  };

  const loginUser = getUser();

  const logoutHandler = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white dark:bg-[#0d131f] border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-emerald-600 flex items-center justify-center p-1 shadow-sm">
              <img
                src="/freepik-modern-linear-money-care-accounting-logo-202503081042289XZP.png"
                alt="Monetrix"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                Monetrix
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 -mt-1">
                Finance OS
              </span>
            </div>
          </Link>

          {/* Desktop Right Nav */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleTheme}
              aria-label="Toggle color theme"
              className="p-2 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors shadow-sm"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {loginUser ? (
              <div className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="w-7 h-7 rounded bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
                    {loginUser?.name ? loginUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                      {loginUser?.name || 'Account'}
                    </span>
                    <span className="text-[10px] text-slate-400 leading-tight truncate max-w-[120px]">
                      {loginUser?.email || 'Active Plan'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={logoutHandler}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-md border border-rose-200 dark:border-rose-900/40 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-emerald-600"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md shadow-sm transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
            {loginUser ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-md bg-slate-100 dark:bg-slate-800">
                  <div className="w-8 h-8 rounded bg-emerald-600 flex items-center justify-center text-white font-bold">
                    {loginUser?.name ? loginUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{loginUser?.name}</div>
                    <div className="text-xs text-slate-500">{loginUser?.email}</div>
                  </div>
                </div>
                <button
                  onClick={logoutHandler}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-md text-rose-600 bg-rose-50 dark:bg-rose-950/40 text-xs font-bold"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  className="py-2 text-center text-xs font-bold rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="py-2 text-center text-xs font-bold rounded-md bg-emerald-600 text-white"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
