import React from 'react';

/**
 * SkeletonBlock - Reusable diagonal shimmering placeholder block
 * Shimmer sweeps diagonally from top-left (-200% -200%) to bottom-right (200% 200%)
 */
export const SkeletonBlock = ({ className = '', style = {} }) => (
  <div
    className={`skeleton-diagonal rounded-[4px] ${className}`}
    style={style}
  />
);

/**
 * TrendCardSkeleton - Diagonal skeleton loader for KPI metric cards
 */
export const TrendCardSkeleton = ({ delay = 0 }) => {
  return (
    <div
      className="relative flex flex-col justify-between overflow-hidden rounded-[6px] bg-[#141416] dark:bg-[#11141a] border border-white/10 dark:border-white/5 p-3.5 sm:p-4 shadow-lg"
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Top Header Row: Icon & Title Placeholder */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SkeletonBlock className="w-4 h-4 rounded" />
          <SkeletonBlock className="w-28 sm:w-36 h-3.5" />
        </div>
        <SkeletonBlock className="w-12 h-4 rounded-[4px]" />
      </div>

      {/* Metric Value Row: Big Stat & Pill Badge */}
      <div className="flex items-baseline justify-between mt-3 mb-1">
        <SkeletonBlock className="w-32 sm:w-40 h-8 rounded" />
        <SkeletonBlock className="w-16 h-5 rounded-[4px]" />
      </div>

      {/* Animated Sparkline Area Placeholder */}
      <div className="relative h-16 sm:h-20 w-full mt-2 overflow-hidden rounded-[4px]">
        <SkeletonBlock className="w-full h-full" />
      </div>

      {/* Bottom Timeline Dates Placeholder */}
      <div className="flex items-center justify-between pt-2">
        <SkeletonBlock className="w-12 h-3" />
        <SkeletonBlock className="w-10 h-3" />
      </div>
    </div>
  );
};

/**
 * TableSkeleton - Diagonal skeleton loader for the desktop transactions table
 */
export const TableSkeleton = ({ rows = 6 }) => {
  return (
    <div className="hidden md:block w-full overflow-hidden rounded-md bg-white dark:bg-[#0e1626] border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-700 dark:text-slate-200">
          <thead className="bg-slate-100 dark:bg-slate-800/80 text-[11px] uppercase font-bold tracking-wider text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="py-4 px-4 sm:px-6">Date</th>
              <th className="py-4 px-4 sm:px-6">Description</th>
              <th className="py-4 px-4 sm:px-6">Category</th>
              <th className="py-4 px-4 sm:px-6">Type</th>
              <th className="py-4 px-4 sm:px-6 text-right">Amount</th>
              <th className="py-4 px-4 sm:px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {Array.from({ length: rows }).map((_, idx) => (
              <tr key={idx} className="transition-colors">
                {/* Date */}
                <td className="py-4 px-4 sm:px-6">
                  <SkeletonBlock className="w-24 h-4" />
                </td>
                {/* Description */}
                <td className="py-4 px-4 sm:px-6">
                  <div className="space-y-1">
                    <SkeletonBlock className="w-36 sm:w-48 h-4" />
                    <SkeletonBlock className="w-20 h-2.5 opacity-60" />
                  </div>
                </td>
                {/* Category badge */}
                <td className="py-4 px-4 sm:px-6">
                  <SkeletonBlock className="w-16 h-5 rounded-[4px]" />
                </td>
                {/* Type badge */}
                <td className="py-4 px-4 sm:px-6">
                  <SkeletonBlock className="w-20 h-5 rounded-[4px]" />
                </td>
                {/* Amount */}
                <td className="py-4 px-4 sm:px-6 text-right">
                  <div className="flex justify-end">
                    <SkeletonBlock className="w-24 h-4" />
                  </div>
                </td>
                {/* Actions */}
                <td className="py-4 px-4 sm:px-6 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <SkeletonBlock className="w-6 h-6 rounded" />
                    <SkeletonBlock className="w-6 h-6 rounded" />
                    <SkeletonBlock className="w-6 h-6 rounded" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/**
 * MobileCardSkeleton - Diagonal skeleton loader for the mobile/tablet transaction cards
 */
export const MobileCardSkeleton = ({ count = 4 }) => {
  return (
    <div className="block md:hidden space-y-3">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="p-4 rounded-md bg-white dark:bg-[#0e1626] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1.5 flex-1">
              <SkeletonBlock className="w-40 h-4" />
              <SkeletonBlock className="w-24 h-3 opacity-60" />
            </div>
            <SkeletonBlock className="w-20 h-5" />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-2">
              <SkeletonBlock className="w-14 h-5 rounded-[4px]" />
              <SkeletonBlock className="w-16 h-5 rounded-[4px]" />
            </div>
            <div className="flex items-center gap-1.5">
              <SkeletonBlock className="w-6 h-6 rounded" />
              <SkeletonBlock className="w-6 h-6 rounded" />
              <SkeletonBlock className="w-6 h-6 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
