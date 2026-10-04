import React from 'react';
import { Loader2 } from 'lucide-react';

const Spinner = ({ fullPage = false, message = "Loading Monetrix..." }) => {
  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/40 backdrop-blur-md">
        <div className="relative flex flex-col items-center p-8 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800">
          <div className="relative flex items-center justify-center w-16 h-16 mb-4">
            <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping"></div>
            <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
          </div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 tracking-wide animate-pulse">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 w-full">
      <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-2" />
      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{message}</span>
    </div>
  );
};

export default Spinner;
