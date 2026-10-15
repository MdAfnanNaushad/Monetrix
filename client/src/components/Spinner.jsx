import React from 'react';
import LottieAnimation from './LottieAnimation';
import loadingAnimation from './loading.json';

const Spinner = ({ fullPage = false, message = "Loading Monetrix..." }) => {
  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-md">
        <div className="relative flex flex-col items-center p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-[6px] shadow-2xl border border-slate-200 dark:border-slate-800 max-w-xs w-full text-center">
          <div className="w-24 h-24 sm:w-28 sm:h-28 mb-2 flex items-center justify-center">
            <LottieAnimation animationData={loadingAnimation} loop={true} autoplay={true} />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 tracking-wide animate-pulse">
            {message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-10 w-full">
      <div className="w-20 h-20 sm:w-24 sm:h-24 mb-1 flex items-center justify-center">
        <LottieAnimation animationData={loadingAnimation} loop={true} autoplay={true} />
      </div>
      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 animate-pulse tracking-wide">
        {message}
      </span>
    </div>
  );
};

export default Spinner;
