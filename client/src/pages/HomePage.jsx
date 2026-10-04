import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/layouts/Layout';
import Analytics from '../components/Analytics';
import Spinner from '../components/Spinner';
import CountUp from '../components/CountUp';
import { useToast } from '../context/ToastContext';
import {
  Plus,
  Table as TableIcon,
  PieChart,
  Calendar,
  Filter,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Edit2,
  Trash2,
  Eye,
  X,
  Search,
  Download,
  AlertCircle,
  Tag,
  Wallet,
  TrendingUp,
  Activity,
} from 'lucide-react';

const CATEGORIES = [
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

const HomePage = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [allTransaction, setAllTransaction] = useState([]);
  const [frequency, setFrequency] = useState('30');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [type, setType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewData, setViewData] = useState('table'); // 'table' | 'analytics'

  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [editable, setEditable] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewTransaction, setViewTransaction] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    amount: '',
    type: 'expense',
    category: 'food',
    date: moment().format('YYYY-MM-DD'),
    description: '',
  });

  const API_URL = import.meta.env.VITE_API_URL || '/api/v1';

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      setLoading(true);
      const payload = {
        frequency,
        selectedDate:
          frequency === 'custom' && customStartDate && customEndDate
            ? [moment(customStartDate).startOf('day').toISOString(), moment(customEndDate).endOf('day').toISOString()]
            : [],
        type: type.toLowerCase(),
      };

      const res = await axios.post(`${API_URL}/transactions/get-transactions`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200) {
        setAllTransaction(res.data || []);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        toast.error('Failed to load transaction data.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [frequency, customStartDate, customEndDate, type]);

  const handleOpenAddModal = (defaultType = 'expense') => {
    setEditable(null);
    setFormData({
      amount: '',
      type: defaultType,
      category: defaultType === 'income' ? 'salary' : 'food',
      date: moment().format('YYYY-MM-DD'),
      description: '',
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (record) => {
    setEditable(record);
    setFormData({
      amount: record.amount,
      type: record.type ? record.type.toLowerCase() : 'expense',
      category: record.category ? record.category.toLowerCase() : 'food',
      date: moment(record.date).format('YYYY-MM-DD'),
      description: record.description || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || Number(formData.amount) <= 0) {
      toast.error('Please enter a valid amount greater than 0.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      setLoading(true);
      const endpoint = editable
        ? `${API_URL}/transactions/edit-transaction`
        : `${API_URL}/transactions/add-transaction`;

      const payload = editable
        ? {
            transactionId: editable._id,
            payload: {
              ...formData,
              amount: Number(formData.amount),
            },
          }
        : {
            ...formData,
            amount: Number(formData.amount),
          };

      const res = await axios.post(endpoint, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200 || res.status === 201) {
        toast.success(editable ? 'Transaction updated successfully!' : 'New transaction recorded!');
        setShowModal(false);
        setEditable(null);

        // Optimistically update or prepend transaction in state for instant UI update
        if (res.data?.transaction) {
          const newTxn = res.data.transaction;
          if (editable) {
            setAllTransaction((prev) =>
              prev.map((t) => (t._id === editable._id ? newTxn : t))
            );
          } else {
            setAllTransaction((prev) => [newTxn, ...prev]);
          }
        }

        if (formData.type === 'income') {
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.8 },
            colors: ['#10b981', '#34d399', '#059669'],
          });
        }

        await fetchTransactions();
      }
    } catch (error) {
      toast.error('Failed to save transaction.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (transactionId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      setLoading(true);
      const res = await axios.post(
        `${API_URL}/transactions/delete-transaction`,
        { transactionId },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        toast.success('Transaction removed successfully.');
        setAllTransaction((prev) => prev.filter((t) => t._id !== transactionId));
        setDeleteConfirmId(null);
      }
    } catch (error) {
      toast.error('Could not delete transaction.');
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = allTransaction.filter((txn) => {
    const matchesSearch =
      txn.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.category?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || txn.category?.toLowerCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalIn = allTransaction
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + Number(t.amount || 0), 0);
  const totalOut = allTransaction
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + Number(t.amount || 0), 0);
  const netAmount = totalIn - totalOut;

  const handleExportCSV = () => {
    if (allTransaction.length === 0) {
      toast.info('No transactions available to export.');
      return;
    }
    const headers = ['Date', 'Type', 'Category', 'Amount', 'Description'];
    const rows = allTransaction.map((t) => [
      moment(t.date).format('YYYY-MM-DD'),
      t.type,
      t.category,
      t.amount,
      `"${(t.description || '').replace(/"/g, '""')}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Monetrix_Transactions_${moment().format('YYYYMMDD')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Transaction history exported as CSV!');
  };

  return (
    <Layout>
      {/* FULL-WIDTH STATS HEADER (Solid Dark, No Gradients, 8px Radius Max) */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full p-6 sm:p-8 rounded-md bg-slate-900 border border-slate-800 text-white shadow-sm mb-8"
      >
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-slate-800 border border-slate-700 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <span>Financial Command Operating System</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Portfolio Overview</h1>
            <p className="text-sm text-slate-400 max-w-2xl">
              Inspect transaction velocity, analyze categorical allocation, and record new financial entries with real-time auditability.
            </p>
          </div>

          {/* KPI Capsule with Counter Up */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-950 p-4 rounded-md border border-slate-800">
            <div className="px-3 py-1">
              <span className="text-[11px] uppercase font-bold text-slate-400 block">Total Net Balance</span>
              <span className={`text-2xl font-mono font-extrabold ${netAmount >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                <CountUp end={netAmount} prefix="$" decimals={2} />
              </span>
            </div>
            <div className="px-3 py-1 border-t sm:border-t-0 sm:border-l border-slate-800">
              <span className="text-[11px] uppercase font-bold text-slate-400 block">Total Inflow</span>
              <span className="text-xl font-mono font-bold text-emerald-400">
                +<CountUp end={totalIn} prefix="$" decimals={2} />
              </span>
            </div>
            <div className="px-3 py-1 border-t sm:border-t-0 sm:border-l border-slate-800">
              <span className="text-[11px] uppercase font-bold text-slate-400 block">Total Outflow</span>
              <span className="text-xl font-mono font-bold text-rose-400">
                -<CountUp end={totalOut} prefix="$" decimals={2} />
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* CONTROL BAR (Filters, Search, View Mode, Export, Add) */}
      <div className="w-full p-4 sm:p-5 rounded-md bg-white dark:bg-[#0e1626] border border-slate-200 dark:border-slate-800 shadow-sm mb-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Frequency Selector */}
            <div className="relative">
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="pl-9 pr-8 py-2 text-xs font-bold rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 appearance-none cursor-pointer"
              >
                <option value="7">Last 7 Days</option>
                <option value="30">Last 30 Days</option>
                <option value="90">Last Quarter (90d)</option>
                <option value="365">Last 1 Year</option>
                <option value="custom">Custom Date Range</option>
              </select>
              <Calendar className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Quick Type Filter Tabs */}
            <div className="flex items-center p-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700">
              <button
                onClick={() => setType('all')}
                className={`px-3 py-1.5 text-xs font-bold rounded transition-all ${
                  type === 'all'
                    ? 'bg-slate-900 dark:bg-slate-700 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setType('income')}
                className={`flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded transition-all ${
                  type === 'income'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400'
                }`}
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Income</span>
              </button>
              <button
                onClick={() => setType('expense')}
                className={`flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded transition-all ${
                  type === 'expense'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400'
                }`}
              >
                <ArrowDownRight className="w-3.5 h-3.5" />
                <span>Expense</span>
              </button>
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-9 pr-8 py-2 text-xs font-bold rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 appearance-none cursor-pointer capitalize"
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="capitalize">
                    {cat}
                  </option>
                ))}
              </select>
              <Tag className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {frequency === 'custom' && (
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="px-2.5 py-1.5 text-xs rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                />
                <span className="text-xs text-slate-400">to</span>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="px-2.5 py-1.5 text-xs rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {/* View Switcher */}
            <div className="flex items-center p-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700">
              <button
                onClick={() => setViewData('table')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded transition-all ${
                  viewData === 'table'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>Transactions</span>
              </button>
              <button
                onClick={() => setViewData('analytics')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded transition-all ${
                  viewData === 'analytics'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <PieChart className="w-3.5 h-3.5" />
                <span>Recharts Analytics</span>
              </button>
            </div>

            {/* CSV Export */}
            <button
              onClick={handleExportCSV}
              className="p-2 rounded-md border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm"
              title="Export as CSV"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Add Transaction Button */}
            <button
              onClick={handleOpenAddModal}
              className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md shadow-sm active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Record Transaction</span>
            </button>
          </div>
        </div>

        {/* Search Input on Table View */}
        {viewData === 'table' && (
          <div className="pt-2">
            <div className="relative max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search descriptions or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white placeholder-slate-400"
              />
            </div>
          </div>
        )}
      </div>

      {/* MAIN VIEWPORT */}
      {loading && allTransaction.length === 0 ? (
        <Spinner message="Retrieving your financial database..." />
      ) : viewData === 'table' ? (
        /* Expanded Full-Width Table */
        <div className="w-full overflow-hidden rounded-md bg-white dark:bg-[#0e1626] border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700 dark:text-slate-200">
              <thead className="bg-slate-100 dark:bg-slate-800/80 text-[11px] uppercase font-bold tracking-wider text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6">Description</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Flow Type</th>
                  <th className="py-4 px-6 text-right">Amount</th>
                  <th className="py-4 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredTransactions.map((record) => {
                  const isIncome = record.type === 'income';
                  return (
                    <tr
                      key={record._id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors group"
                    >
                      <td className="py-4 px-6 text-xs text-slate-500 dark:text-slate-400 font-mono">
                        {moment(record.date).format('YYYY-MM-DD')}
                      </td>
                      <td className="py-4 px-6 font-semibold text-slate-900 dark:text-slate-100">
                        {record.description || 'Unspecified'}
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold capitalize bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {record.category}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold ${
                            isIncome
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                              : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400'
                          }`}
                        >
                          {isIncome ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                          <span className="capitalize">{record.type}</span>
                        </span>
                      </td>
                      <td className={`py-4 px-6 text-right font-mono font-bold text-sm ${isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-slate-100'}`}>
                        {isIncome ? '+' : '-'}${Number(record.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setViewTransaction(record);
                              setShowViewModal(true);
                            }}
                            className="p-1.5 rounded text-slate-500 hover:text-cyan-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Inspect Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(record)}
                            className="p-1.5 rounded text-slate-500 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(record._id)}
                            className="p-1.5 rounded text-slate-500 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredTransactions.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-16 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <DollarSign className="w-12 h-12 mb-2 opacity-30 stroke-1" />
                        <p className="font-bold text-base text-slate-700 dark:text-slate-300">No transactions recorded</p>
                        <p className="text-xs text-slate-400 mt-1 max-w-sm">
                          Adjust your date frequency or filter options, or click "Record Transaction" to create an entry.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Recharts Analytics View */
        <Analytics allTransaction={allTransaction} />
      )}

      {/* Add / Edit Transaction Modal (Max 8px border radius, no gradient) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md bg-white dark:bg-[#0e1626] rounded-md border border-slate-300 dark:border-slate-700 shadow-xl p-6 sm:p-8 space-y-5"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                {editable ? 'Edit Transaction' : 'Record Transaction'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditable(null);
                }}
                className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                  Type
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({
                      ...prev,
                      type: 'expense',
                      category: prev.type === 'income' ? 'food' : prev.category
                    }))}
                    className={`py-2 text-xs font-bold rounded transition-all ${
                      formData.type === 'expense'
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({
                      ...prev,
                      type: 'income',
                      category: prev.type === 'expense' ? 'salary' : prev.category
                    }))}
                    className={`py-2 text-xs font-bold rounded transition-all ${
                      formData.type === 'income'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Income
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                  Amount ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white capitalize"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="capitalize">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                  Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Server hosting, Dividend payout, Grocery"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md shadow-sm active:scale-95 transition-all"
                >
                  {editable ? 'Save Changes' : 'Confirm Entry'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* View Detail Modal */}
      {showViewModal && viewTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-[#0e1626] rounded-md border border-slate-300 dark:border-slate-700 shadow-xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Transaction Details</h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="p-1 rounded text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-semibold uppercase">Total Amount</span>
                  <span className={`text-2xl font-mono font-bold ${viewTransaction.type === 'income' ? 'text-emerald-600' : 'text-slate-900 dark:text-white'}`}>
                    ${Number(viewTransaction.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-semibold">Category</span>
                  <span className="font-bold capitalize text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                    {viewTransaction.category}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-semibold">Date</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {moment(viewTransaction.date).format('MMMM DD, YYYY')}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-semibold">Classification</span>
                  <span className={`font-bold capitalize ${viewTransaction.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {viewTransaction.type}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Note
                </span>
                <p className="p-3 rounded-md bg-slate-50 dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-300 italic border border-slate-200 dark:border-slate-800">
                  "{viewTransaction.description || 'No notes provided'}"
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-5 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-[#0e1626] rounded-md border border-slate-300 dark:border-slate-700 shadow-xl p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-md bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Delete Transaction</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Are you sure you want to delete this record from the database?
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="py-2 text-xs font-bold rounded-md text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="py-2 text-xs font-bold rounded-md text-white bg-rose-600 hover:bg-rose-700 shadow-sm transition-all"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default HomePage;
