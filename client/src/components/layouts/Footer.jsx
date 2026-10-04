import React from 'react';
import { Heart, ShieldCheck, Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full mt-auto py-8 border-t border-slate-200 dark:border-slate-800/80 bg-white/50 dark:bg-[#090d16]/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span>Monetrix Finance Engine &bull; System Operational</span>
        </div>

        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5 hover:text-emerald-500 transition-colors">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            256-Bit Encrypted Data
          </span>
          <span>&copy; {new Date().getFullYear()} Monetrix Inc. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
