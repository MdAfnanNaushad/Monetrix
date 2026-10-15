import React from 'react';
import { Heart, ShieldCheck, Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full mt-auto py-8 border-t border-slate-200 dark:border-slate-800/80 bg-white/50 dark:bg-[#090d16]/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded bg-[#070b12] border border-slate-700/60 p-0.5 flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
            <img
              src="/monetrix-logo.png"
              alt="Monetrix Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-extrabold text-slate-900 dark:text-white leading-none text-xs">Monetrix</span>
            <span className="text-[10px] text-[#00a8f2] font-semibold">Finance in Focus</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5 hover:text-[#00a8f2] transition-colors">
            <ShieldCheck className="w-4 h-4 text-[#00a8f2]" />
            256-Bit Encrypted Data
          </span>
          <span>&copy; {new Date().getFullYear()} Monetrix Inc. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
