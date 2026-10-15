import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  Settings,
} from 'lucide-react';
import ProfileModal from '../ProfileModal';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const toast = useToast();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const getUser = () => {
    try {
      const raw = localStorage.getItem('user');
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  };

  const [loginUser, setLoginUser] = useState(getUser());

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
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
              <img
                src="/monetrix-logo.png"
                alt="Monetrix Logo"
                className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(52,211,153,0.35)]"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white leading-none">
                Monetrix
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#00a8f2] mt-0.5">
                Finance in Focus
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
                <button
                  onClick={() => setProfileModalOpen(true)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500/50 transition-all text-left group"
                  title="Edit Profile"
                >
                  <div className="w-7 h-7 rounded-full bg-emerald-600 overflow-hidden flex items-center justify-center text-white font-bold text-xs shrink-0 border border-emerald-500/30">
                    {loginUser?.profilePic ? (
                      <img
                        src={loginUser.profilePic}
                        alt={loginUser.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{loginUser?.name ? loginUser.name.charAt(0).toUpperCase() : 'U'}</span>
                    )}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight group-hover:text-emerald-500 transition-colors">
                      {loginUser?.name || 'Account'}
                    </span>
                    <span className="text-[10px] text-slate-400 leading-tight truncate max-w-[120px]">
                      Edit Profile
                    </span>
                  </div>
                </button>

                <button
                  onClick={logoutHandler}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-md border border-rose-200 dark:border-rose-900/40 transition-colors"
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

          {/* Mobile menu button & theme */}
          <div className="flex md:hidden items-center gap-1.5 sm:gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle color theme"
              className="p-2 min-h-[40px] min-w-[40px] flex items-center justify-center rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              className="p-2 min-h-[40px] min-w-[40px] flex items-center justify-center rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu with smooth sliding animation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0, y: -10 }}
              animate={{ height: 'auto', opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: -10 }}
              transition={{ duration: 0.28, ease: 'easeInOut' }}
              className="md:hidden overflow-hidden border-t border-slate-200 dark:border-slate-800"
            >
              <div className="py-3.5 pb-4 space-y-3">
                {loginUser ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-md bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                      <div className="w-10 h-10 rounded-full bg-emerald-600 overflow-hidden flex items-center justify-center text-white font-bold text-sm shrink-0 border border-emerald-500/30">
                        {loginUser?.profilePic ? (
                          <img
                            src={loginUser.profilePic}
                            alt={loginUser.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>{loginUser?.name ? loginUser.name.charAt(0).toUpperCase() : 'U'}</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-slate-800 dark:text-slate-100 text-sm truncate">{loginUser?.name || 'User'}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{loginUser?.email || 'Authenticated'}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setProfileModalOpen(true);
                        }}
                        className="flex-1 min-h-[44px] flex items-center justify-center gap-2 py-2.5 rounded-md text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-xs font-semibold active:scale-[0.99] transition-all"
                      >
                        <Settings className="w-4 h-4" />
                        Edit Profile
                      </button>
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          logoutHandler();
                        }}
                        className="flex-1 min-h-[44px] flex items-center justify-center gap-2 py-2.5 rounded-md text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 text-xs font-semibold active:scale-[0.99] transition-all"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="min-h-[44px] flex items-center justify-center text-xs font-bold rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 active:scale-[0.98] transition-all"
                    >
                      Sign in
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="min-h-[44px] flex items-center justify-center text-xs font-bold rounded-md bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm active:scale-[0.98] transition-all"
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        onUserUpdated={(updatedUser) => {
          setLoginUser(updatedUser);
        }}
      />
    </header>
  );
};

export default Header;
