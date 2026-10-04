import React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  PieChart as PieChartIcon,
  BarChart3,
  Calendar,
  Layers,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import CountUp from './CountUp';

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

  // Recharts Data Prep: Category Breakdown
  const categoryData = categories
    .map((cat) => {
      const incomeAmt = incomeTransactions
        .filter((t) => t.category?.toLowerCase() === cat)
        .reduce((acc, t) => acc + Number(t.amount || 0), 0);
      const expenseAmt = expenseTransactions
        .filter((t) => t.category?.toLowerCase() === cat)
        .reduce((acc, t) => acc + Number(t.amount || 0), 0);

      return {
        name: cat.charAt(0).toUpperCase() + cat.slice(1),
        Income: incomeAmt,
        Expense: expenseAmt,
        Total: incomeAmt + expenseAmt,
      };
    })
    .filter((c) => c.Total > 0);

  // Expense Pie Data
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

  // Velocity ratio summary
  const velocityData = [
    { name: 'Income', value: totalIncomeTurnover, fill: '#10b981' },
    { name: 'Expense', value: totalExpenseTurnover, fill: '#ef4444' },
  ];

  return (
    <div className="space-y-8 animate-fade-in w-full">
      {/* KPI METRIC CARDS with Framer-Motion & Counter-Up Animations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {/* Net Savings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          whileHover={{ y: -3 }}
          className="p-6 rounded-md bg-white dark:bg-[#0e1626] border border-slate-200 dark:border-slate-800 shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Net Balance
            </span>
            <div className={`p-2 rounded-md ${netSavings >= 0 ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400' : 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'}`}>
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black font-mono text-slate-900 dark:text-white">
            <CountUp end={netSavings} prefix="$" decimals={2} />
          </div>
          <p className="mt-2 text-xs text-slate-500 font-medium">
            {netSavings >= 0 ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">&uarr; Surplus Portfolio Margin</span>
            ) : (
              <span className="text-rose-600 dark:text-rose-400 font-bold">&darr; Deficit Alert</span>
            )}
          </p>
        </motion.div>

        {/* Total Inflow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          whileHover={{ y: -3 }}
          className="p-6 rounded-md bg-white dark:bg-[#0e1626] border border-slate-200 dark:border-slate-800 shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Inflow
            </span>
            <div className="p-2 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400">
            <CountUp end={totalIncomeTurnover} prefix="$" decimals={2} />
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>{incomeTxnCount} receipts</span>
            <span className="font-bold text-emerald-600">
              <CountUp end={totalTurnover > 0 ? (totalIncomeTurnover / totalTurnover) * 100 : 0} suffix="%" decimals={1} />
            </span>
          </div>
        </motion.div>

        {/* Total Outflow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          whileHover={{ y: -3 }}
          className="p-6 rounded-md bg-white dark:bg-[#0e1626] border border-slate-200 dark:border-slate-800 shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Expenses
            </span>
            <div className="p-2 rounded-md bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black font-mono text-rose-600 dark:text-rose-400">
            <CountUp end={totalExpenseTurnover} prefix="$" decimals={2} />
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>{expenseTxnCount} outflows</span>
            <span className="font-bold text-rose-600">
              <CountUp end={totalTurnover > 0 ? (totalExpenseTurnover / totalTurnover) * 100 : 0} suffix="%" decimals={1} />
            </span>
          </div>
        </motion.div>

        {/* Gross Volume */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          whileHover={{ y: -3 }}
          className="p-6 rounded-md bg-white dark:bg-[#0e1626] border border-slate-200 dark:border-slate-800 shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Gross Volume
            </span>
            <div className="p-2 rounded-md bg-cyan-100 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black font-mono text-slate-900 dark:text-white">
            <CountUp end={totalTurnover} prefix="$" decimals={2} />
          </div>
          <div className="mt-2 text-xs text-slate-500">
            {totalTransaction} executed transactions
          </div>
        </motion.div>
      </div>

      {/* RECHARTS ANIMATED VISUALIZATIONS */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Bar Chart: Category Cashflow Comparison */}
        <div className="xl:col-span-2 p-6 rounded-md bg-white dark:bg-[#0e1626] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-600" />
                Category Cashflow Breakdown (Recharts)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Direct comparison of incoming vs outgoing capital across spending sectors
              </p>
            </div>
          </div>

          <div className="h-80 w-full pt-4">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#888888' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#888888' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '6px',
                      color: '#ffffff',
                      fontSize: '12px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="Income" fill="#10b981" radius={[4, 4, 0, 0]} animationDuration={1200} />
                  <Bar dataKey="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} animationDuration={1200} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs italic">
                No categorical entries found for the selected timeline.
              </div>
            )}
          </div>
        </div>

        {/* Pie Chart: Expense Distribution */}
        <div className="p-6 rounded-md bg-white dark:bg-[#0e1626] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PieChartIcon className="w-4 h-4 text-emerald-600" />
              Expense Distribution
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Percentage allocation by cost category
            </p>
          </div>

          <div className="h-80 w-full flex items-center justify-center">
            {expensePieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expensePieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                    animationDuration={1200}
                  >
                    {expensePieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PALETTE[index % PALETTE.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val) => `$${Number(val).toLocaleString()}`}
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '6px',
                      color: '#ffffff',
                      fontSize: '12px',
                    }}
                  />
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs italic">
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
