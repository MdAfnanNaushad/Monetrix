import React from 'react';
import { motion } from 'framer-motion';
import moment from 'moment';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  PieChart as PieChartIcon,
  Calendar,
  Layers,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import CountUp from './CountUp';
import TrendCard from './TrendCard';

const PALETTE = ['#10b981', '#06b6d4', '#f59e0b', '#8b5cf6', '#ec4899', '#f43f5e', '#64748b', '#3b82f6'];

const Analytics = ({ allTransaction = [] }) => {
  const categories = [
    'salary',
    'tip',
    'project',
    'food',
    'movie',
    'bills',
    'medical',
    'fee',
    'tax',
  ];

  const totalTransaction = allTransaction.length;
  const incomeTransactions = allTransaction.filter((txn) => txn.type === 'income');
  const expenseTransactions = allTransaction.filter((txn) => txn.type === 'expense');

  const incomeTxnCount = incomeTransactions.length;
  const expenseTxnCount = expenseTransactions.length;

  // Turnover calculations
  const totalIncomeTurnover = incomeTransactions.reduce((acc, t) => acc + Number(t.amount || 0), 0);
  const totalExpenseTurnover = expenseTransactions.reduce((acc, t) => acc + Number(t.amount || 0), 0);
  const totalTurnover = totalIncomeTurnover + totalExpenseTurnover;
  const netSavings = totalIncomeTurnover - totalExpenseTurnover;

  // Area Chart Data Prep: Chronological Cashflow Trends
  const timelineMap = {};
  [...allTransaction]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .forEach((txn) => {
      const dateKey = moment(txn.date).format('MMM DD');
      if (!timelineMap[dateKey]) {
        timelineMap[dateKey] = { date: dateKey, Income: 0, Expense: 0, Net: 0 };
      }
      const amt = Number(txn.amount || 0);
      if (txn.type === 'income') {
        timelineMap[dateKey].Income += amt;
      } else {
        timelineMap[dateKey].Expense += amt;
      }
      timelineMap[dateKey].Net = timelineMap[dateKey].Income - timelineMap[dateKey].Expense;
    });

  const timelineData = Object.values(timelineMap);

  // Expense Pie Data: Category Percentage
  const expensePieData = categories
    .map((cat) => {
      const amount = expenseTransactions
        .filter((t) => t.category?.toLowerCase() === cat)
        .reduce((acc, t) => acc + Number(t.amount || 0), 0);
      return {
        name: cat.charAt(0).toUpperCase() + cat.slice(1),
        value: amount,
      };
    })
    .filter((i) => i.value > 0);

  return (
    <div className="space-y-8 animate-fade-in w-full font-sans">
      {/* KPI METRIC CARDS with Animated Trend Graphs of Distinct Colors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <TrendCard
          title="Net Portfolio Balance"
          icon={DollarSign}
          amount={netSavings}
          prefix="₹"
          decimals={2}
          badgeText={netSavings >= 0 ? "↗ Margin" : "↘ Deficit"}
          badgeType={netSavings >= 0 ? "positive" : "negative"}
          sparklineData={timelineData.map(d => ({ name: d.date, value: d.Net }))}
          strokeColor="#f97316" // Orange
          gradientId="analyticsNetGrad"
          startDate={timelineData[0]?.date || "Start"}
          endDate={timelineData[timelineData.length - 1]?.date || "Now"}
          delay={0}
        />

        <TrendCard
          title="Total Inflow Receipts"
          icon={TrendingUp}
          amount={totalIncomeTurnover}
          prefix="₹"
          decimals={2}
          badgeText="↗ Growth"
          badgeType="positive"
          sparklineData={timelineData.map(d => ({ name: d.date, value: d.Income }))}
          strokeColor="#10b981" // Emerald
          gradientId="analyticsInflowGrad"
          startDate={timelineData[0]?.date || "Start"}
          endDate={timelineData[timelineData.length - 1]?.date || "Now"}
          delay={0.08}
        />

        <TrendCard
          title="Total Capital Outflow"
          icon={TrendingDown}
          amount={totalExpenseTurnover}
          prefix="₹"
          decimals={2}
          badgeText="↘ Overhead"
          badgeType="negative"
          sparklineData={timelineData.map(d => ({ name: d.date, value: d.Expense }))}
          strokeColor="#f43f5e" // Rose / Crimson
          gradientId="analyticsExpenseGrad"
          startDate={timelineData[0]?.date || "Start"}
          endDate={timelineData[timelineData.length - 1]?.date || "Now"}
          delay={0.16}
        />

        <TrendCard
          title="Gross Trading Volume"
          icon={Activity}
          amount={totalTurnover}
          prefix="₹"
          decimals={2}
          badgeText="⚡ Active"
          badgeType="neutral"
          sparklineData={timelineData.map(d => ({ name: d.date, value: d.Income + d.Expense }))}
          strokeColor="#06b6d4" // Cyan
          gradientId="analyticsVolumeGrad"
          startDate={timelineData[0]?.date || "Start"}
          endDate={timelineData[timelineData.length - 1]?.date || "Now"}
          delay={0.24}
        />
      </div>

      {/* RECHARTS ANIMATED VISUALIZATIONS (Area Chart & Pie Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Area Chart: Cashflow Velocity Timeline */}
        <div className="lg:col-span-2 p-4 sm:p-6 rounded-md bg-white dark:bg-[#0e1626] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 sm:space-y-4">
          <div className="space-y-1">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Cashflow Velocity Timeline (Area Chart)</span>
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
              Cumulative chronological comparison of incoming capital vs expenditures
            </p>
          </div>

          <div className="h-64 sm:h-80 w-full pt-2">
            {timelineData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="incomeArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="expenseArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#888888', fontFamily: 'Inter' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#888888', fontFamily: 'Inter' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '6px',
                      color: '#ffffff',
                      fontSize: '12px',
                      fontFamily: 'Inter',
                    }}
                    formatter={(val) => `₹${Number(val).toLocaleString('en-IN')}`}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px', fontFamily: 'Inter' }} />
                  <Area
                    type="monotone"
                    dataKey="Income"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#incomeArea)"
                    animationDuration={1200}
                  />
                  <Area
                    type="monotone"
                    dataKey="Expense"
                    stroke="#ef4444"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#expenseArea)"
                    animationDuration={1200}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs italic font-sans">
                No chronological transactions recorded for this period.
              </div>
            )}
          </div>
        </div>

        {/* Pie Chart: Expense Distribution */}
        <div className="p-4 sm:p-6 rounded-md bg-white dark:bg-[#0e1626] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 sm:space-y-4">
          <div className="space-y-1">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PieChartIcon className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Expense Distribution (Pie Chart)</span>
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
              Percentage allocation by cost category
            </p>
          </div>

          <div className="h-64 sm:h-80 w-full flex items-center justify-center">
            {expensePieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expensePieData}
                    cx="50%"
                    cy="45%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                    animationDuration={1200}
                  >
                    {expensePieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PALETTE[index % PALETTE.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val) => `₹${Number(val).toLocaleString('en-IN')}`}
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '6px',
                      color: '#ffffff',
                      fontSize: '12px',
                      fontFamily: 'Inter',
                    }}
                  />
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: '11px', paddingTop: '4px', fontFamily: 'Inter' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs italic font-sans">
                No expense entries to chart.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
