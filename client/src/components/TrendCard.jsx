import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import CountUp from './CountUp';

/**
 * TrendCard - A sleek financial KPI card matching modern fintech analytics dashboards
 * Features:
 * - Clean title with contextual Lucide icon
 * - Large high-contrast metric with CountUp
 * - Pill badge for percentage delta with arrow
 * - Integrated animated AreaChart sparkline with custom gradient and glow
 * - Dynamic start/end date axis badges
 */
const TrendCard = ({
  title,
  icon: Icon,
  amount,
  prefix = '₹',
  decimals = 2,
  badgeText = '+12%',
  badgeType = 'positive', // 'positive' | 'negative' | 'neutral'
  sparklineData = [],
  strokeColor = '#f59e0b',
  gradientId = 'sparklineGrad',
  startDate = '01 Oct',
  endDate = 'Now',
  delay = 0,
}) => {
  const isPositive = badgeType === 'positive';
  const isNegative = badgeType === 'negative';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="relative flex flex-col justify-between overflow-hidden rounded-[6px] bg-[#141416] dark:bg-[#11141a] border border-white/10 dark:border-white/5 p-3.5 sm:p-4 shadow-lg transition-all"
    >
      {/* Background Subtle Vibrant Green Watermark Logo Overlay */}
      <div className="absolute -right-6 -bottom-6 w-36 h-36 sm:w-44 sm:h-44 pointer-events-none z-0 select-none opacity-[0.14] dark:opacity-[0.18] overflow-hidden">
        <img
          src="/monetrix-logo.png"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]"
        />
      </div>

      {/* Top Header Row: Icon & Title */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-1.5 text-slate-400">
          {Icon && <Icon className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
          <span className="text-xs font-medium tracking-tight text-slate-300">
            {title}
          </span>
        </div>
      </div>

      {/* Middle Value Row: Big Stat & Percentage Pill Badge */}
      <div className="flex items-baseline justify-between mt-2 mb-0.5 z-10">
        <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-sans">
          <CountUp end={amount} prefix={prefix} decimals={decimals} />
        </div>

        <div
          className={`flex items-center gap-1 text-xs font-semibold ${isPositive
              ? 'text-emerald-400'
              : isNegative
                ? 'text-rose-400'
                : 'text-amber-400'
            }`}
        >
          <span>{badgeText}</span>
        </div>
      </div>

      {/* Animated Sparkline Area Graph */}
      <div className="relative h-16 sm:h-20 w-full -mx-1 -mb-1 mt-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sparklineData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={strokeColor} stopOpacity={0.45} />
                <stop offset="65%" stopColor={strokeColor} stopOpacity={0.08} />
                <stop offset="100%" stopColor={strokeColor} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-md bg-[#0a0d14] px-2.5 py-1 text-xs text-white border border-slate-700 shadow-md">
                      <span className="text-slate-400 mr-1.5">{payload[0].payload.name}:</span>
                      <span className="font-bold font-sans">₹{Number(payload[0].value).toLocaleString('en-IN')}</span>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={strokeColor}
              strokeWidth={2.8}
              fillOpacity={1}
              fill={`url(#${gradientId})`}
              isAnimationActive={true}
              animationDuration={1400}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom Timeline Dates Row */}
      <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 pt-1 z-10">
        <span>{startDate}</span>
        <span>{endDate}</span>
      </div>
    </motion.div>
  );
};

export default TrendCard;
