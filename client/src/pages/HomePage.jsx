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
import TrendCard from '../components/TrendCard';
import { TrendCardSkeleton, TableSkeleton, MobileCardSkeleton } from '../components/SkeletonLoaders';
import ProfileModal from '../components/ProfileModal';
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
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [showProfileModal, setShowProfileModal] = useState(false);

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

  // Lazy loading pagination states
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const observerRef = React.useRef(null);

  const API_URL = import.meta.env.VITE_API_URL || '/api/v1';

  // Fetch initial batch (Page 1 - 10 items) or reset on filters change
  const fetchTransactions = async (resetPage = 1) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      if (resetPage === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const payload = {
        frequency,
        selectedDate:
          frequency === 'custom' && customStartDate && customEndDate
            ? [moment(customStartDate).startOf('day').toISOString(), moment(customEndDate).endOf('day').toISOString()]
            : [],
        type: type.toLowerCase(),
        page: resetPage,
        limit: 10,
      };

      const res = await axios.post(`${API_URL}/transactions/get-transactions`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200) {
        const fetchedList = Array.isArray(res.data) ? res.data : (res.data.transactions || []);
        const serverHasMore = res.data.hasMore !== undefined ? res.data.hasMore : fetchedList.length === 10;

        if (resetPage === 1) {
          setAllTransaction(fetchedList);
        } else {
          setAllTransaction((prev) => {
            const existingIds = new Set(prev.map((t) => t._id));
            const freshItems = fetchedList.filter((t) => !existingIds.has(t._id));
            return [...prev, ...freshItems];
          });
        }

        setPage(resetPage);
        setHasMore(serverHasMore);
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
      setLoadingMore(false);
    }
  };

  // Reset pagination when frequency or type changes
  useEffect(() => {
    fetchTransactions(1);
  }, [frequency, customStartDate, customEndDate, type]);

  // Infinite Scroll IntersectionObserver
  useEffect(() => {
    if (loading || loadingMore || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          fetchTransactions(page + 1);
        }
      },
      { rootMargin: '200px' }
    );

    const target = observerRef.current;
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [loading, loadingMore, hasMore, page]);

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

  // Build chronological sparkline data series for KPI Cards
  const sortedTxns = [...allTransaction].sort((a, b) => new Date(a.date) - new Date(b.date));

  // Net cumulative balance trend
  let runningBal = 0;
  const netSparkline = sortedTxns.map((t) => {
    const amt = Number(t.amount || 0);
    runningBal += t.type === 'income' ? amt : -amt;
    return { name: moment(t.date).format('DD MMM'), value: runningBal };
  });

  // Inflow volume trend
  const incomeSparkline = sortedTxns
    .filter((t) => t.type === 'income')
    .map((t) => ({ name: moment(t.date).format('DD MMM'), value: Number(t.amount || 0) }));

  // Outflow volume trend
  const expenseSparkline = sortedTxns
    .filter((t) => t.type === 'expense')
    .map((t) => ({ name: moment(t.date).format('DD MMM'), value: Number(t.amount || 0) }));

  // Fallback points if user has few entries
  const defaultSparkline = [
    { name: 'W1', value: 300 },
    { name: 'W2', value: 850 },
    { name: 'W3', value: 450 },
    { name: 'W4', value: 1200 },
    { name: 'W5', value: 920 },
    { name: 'W6', value: 1650 },
  ];

  const firstDate = sortedTxns.length ? moment(sortedTxns[0].date).format('DD MMM') : 'Start';
  const lastDate = sortedTxns.length ? moment(sortedTxns[sortedTxns.length - 1].date).format('DD MMM') : 'Now';

  return (
    <Layout>
      {/* TOP HEADER TITLE WITH WELCOME USER BUTTON */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Portfolio Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl font-normal">
            Real-time cashflow telemetry, velocity indices, and active portfolio margin tracking.
          </p>
        </div>

        {/* Welcome Username Button that triggers Profile Edit modal */}
        {currentUser && (
          <button
            onClick={() => setShowProfileModal(true)}
            className="self-start sm:self-auto flex items-center gap-2.5 px-3.5 py-2 rounded-md bg-white dark:bg-[#0e1626] border border-slate-200 dark:border-slate-800 hover:border-emerald-500/60 transition-all shadow-sm group"
            title="Edit Profile"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-600 overflow-hidden flex items-center justify-center text-white font-bold text-xs shrink-0 border border-emerald-500/30">
              {currentUser?.profilePic ? (
                <img
                  src={currentUser.profilePic}
                  alt={currentUser.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}</span>
              )}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[11px] text-slate-400 font-medium leading-none">Welcome back,</span>
              <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-emerald-500 transition-colors mt-0.5">
                {currentUser?.name || 'User'}
              </span>
            </div>
          </button>
        )}
      </div>

      {/* NEW FINTECH KPI CARDS (With Top-Left to Bottom-Right Diagonal Skeleton Loading) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 mb-8">
        {loading ? (
          <>
            <TrendCardSkeleton delay={0} />
            <TrendCardSkeleton delay={0.12} />
            <TrendCardSkeleton delay={0.24} />
          </>
        ) : (
          <>
            {/* Card 1: Net Margin / Balance with Lottie Cyan Glow (#00a8f2) */}
            <TrendCard
              title="Monthly Profit Overview"
              icon={TrendingUp}
              amount={netAmount}
              prefix="₹"
              decimals={2}
              badgeText="↗ 16%"
              badgeType="positive"
              sparklineData={netSparkline.length >= 3 ? netSparkline : defaultSparkline}
              strokeColor="#00a8f2"
              gradientId="cyanLottieGlow"
              startDate={firstDate}
              endDate={lastDate}
              delay={0}
            />

            {/* Card 2: Total Inflow with Lottie Gold Glow (#f9a806) */}
            <TrendCard
              title="Gross Inflow Volume"
              icon={ArrowUpRight}
              amount={totalIn}
              prefix="₹"
              decimals={2}
              badgeText="↗ 24%"
              badgeType="positive"
              sparklineData={incomeSparkline.length >= 3 ? incomeSparkline : defaultSparkline.map(d => ({ ...d, value: d.value * 1.5 }))}
              strokeColor="#f9a806"
              gradientId="goldLottieGlow"
              startDate={firstDate}
              endDate={lastDate}
              delay={0.1}
            />

            {/* Card 3: Total Outflow with Lottie Magenta / Pink Glow (#f203d0) */}
            <TrendCard
              title="Expenditure & Outflow"
              icon={ArrowDownRight}
              amount={totalOut}
              prefix="₹"
              decimals={2}
              badgeText="↘ 8.4%"
              badgeType="negative"
              sparklineData={expenseSparkline.length >= 3 ? expenseSparkline : defaultSparkline.map(d => ({ ...d, value: d.value * 0.8 }))}
              strokeColor="#f203d0"
              gradientId="pinkLottieGlow"
              startDate={firstDate}
              endDate={lastDate}
              delay={0.2}
            />
          </>
        )}
      </div>

      {/* CONTROL BAR (Filters, Search, View Mode, Export, Add) */}
      <div className="w-full p-3.5 sm:p-5 rounded-md bg-white dark:bg-[#0e1626] border border-slate-200 dark:border-slate-800 shadow-sm mb-6 space-y-3.5 sm:space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Frequency Selector */}
            <div className="relative flex-1 sm:flex-none min-w-[140px]">
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full pl-8 sm:pl-9 pr-7 sm:pr-8 py-2 text-xs font-bold rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 appearance-none cursor-pointer"
              >
                <option value="7">Last 7 Days</option>
                <option value="30">Last 30 Days</option>
                <option value="90">Last Quarter (90d)</option>
                <option value="365">Last 1 Year</option>
                <option value="custom">Custom Date Range</option>
              </select>
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500 absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Quick Type Filter Tabs */}
            <div className="flex items-center p-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700">
              <button
                onClick={() => setType('all')}
                className={`px-2.5 sm:px-3 py-1.5 text-xs font-bold rounded transition-all ${type === 'all'
                    ? 'bg-slate-900 dark:bg-slate-700 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
              >
                All
              </button>
              <button
                onClick={() => setType('income')}
                className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-xs font-bold rounded transition-all ${type === 'income'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400'
                  }`}
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Income</span>
              </button>
              <button
                onClick={() => setType('expense')}
                className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-xs font-bold rounded transition-all ${type === 'expense'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400'
                  }`}
              >
                <ArrowDownRight className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Expense</span>
              </button>
            </div>

            {/* Category Filter */}
            <div className="relative flex-1 sm:flex-none min-w-[130px]">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-8 sm:pl-9 pr-7 sm:pr-8 py-2 text-xs font-bold rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 appearance-none cursor-pointer capitalize"
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="capitalize">
                    {cat}
                  </option>
                ))}
              </select>
              <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500 absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {frequency === 'custom' && (
              <div className="w-full sm:w-auto flex items-center gap-2 pt-1 sm:pt-0">
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="flex-1 sm:flex-none px-2.5 py-1.5 text-xs rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                />
                <span className="text-xs text-slate-400">to</span>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="flex-1 sm:flex-none px-2.5 py-1.5 text-xs rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 pt-1 lg:pt-0">
            {/* View Switcher */}
            <div className="flex items-center p-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700">
              <button
                onClick={() => setViewData('table')}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold rounded transition-all ${viewData === 'table'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                title="Table View"
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Transactions</span>
              </button>
              <button
                onClick={() => setViewData('analytics')}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold rounded transition-all ${viewData === 'analytics'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                title="Analytics View"
              >
                <PieChart className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Analytics</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              {/* CSV Export */}
              <button
                onClick={handleExportCSV}
                className="p-2 min-h-[38px] min-w-[38px] flex items-center justify-center rounded-md border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm"
                title="Export as CSV"
              >
                <Download className="w-4 h-4" />
              </button>

              {/* Add Transaction Button */}
              <button
                onClick={handleOpenAddModal}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 min-h-[38px] text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md shadow-sm active:scale-95 transition-all shrink-0"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span className="hidden xs:inline">Record Transaction</span>
                <span className="xs:hidden">Add</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search Input on Table View */}
        {viewData === 'table' && (
          <div className="pt-1">
            <div className="relative w-full max-w-md">
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
      {viewData === 'table' ? (
        <div className="w-full space-y-4">
          {loading ? (
            <>
              {/* Mobile Skeleton Cards */}
              <MobileCardSkeleton count={5} />
              {/* Desktop Skeleton Table */}
              <TableSkeleton rows={7} />
            </>
          ) : (
            <>
              {/* MOBILE/TABLET CARD VIEW (shown on screens smaller than md) */}
              <div className="block md:hidden space-y-3">
            {filteredTransactions.map((record) => {
              const isIncome = record.type === 'income';
              return (
                <div
                  key={record._id}
                  className="p-4 rounded-md bg-white dark:bg-[#0e1626] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate">
                        {record.description || 'Unspecified'}
                      </div>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">
                        {moment(record.date).format('MMM DD, YYYY')}
                      </div>
                    </div>
                    <div className={`text-right font-mono font-bold text-base shrink-0 ${isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-slate-100'}`}>
                      {isIncome ? '+' : '-'}₹{Number(record.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold capitalize bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {record.category}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold ${isIncome
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                            : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400'
                          }`}
                      >
                        {isIncome ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        <span className="capitalize">{record.type}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setViewTransaction(record);
                          setShowViewModal(true);
                        }}
                        className="p-1.5 rounded text-slate-500 hover:text-cyan-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Inspect"
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
                  </div>
                </div>
              );
            })}

            {filteredTransactions.length === 0 && (
              <div className="p-8 text-center rounded-md bg-white dark:bg-[#0e1626] border border-slate-200 dark:border-slate-800">
                <DollarSign className="w-10 h-10 mb-2 opacity-30 stroke-1 mx-auto text-slate-400" />
                <p className="font-bold text-sm text-slate-700 dark:text-slate-300">No transactions recorded</p>
                <p className="text-xs text-slate-400 mt-1">Adjust filters or tap "Add" to record an entry.</p>
              </div>
            )}
          </div>

          {/* DESKTOP & TABLET WIDE TABLE (visible on md+) */}
          <div className="hidden md:block w-full overflow-hidden rounded-md bg-white dark:bg-[#0e1626] border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700 dark:text-slate-200">
                <thead className="bg-slate-100 dark:bg-slate-800/80 text-[11px] uppercase font-bold tracking-wider text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-4 px-4 sm:px-6">Date</th>
                    <th className="py-4 px-4 sm:px-6">Description</th>
                    <th className="py-4 px-4 sm:px-6">Category</th>
                    <th className="py-4 px-4 sm:px-6">Flow Type</th>
                    <th className="py-4 px-4 sm:px-6 text-right">Amount</th>
                    <th className="py-4 px-4 sm:px-6 text-center">Actions</th>
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
                        <td className="py-4 px-4 sm:px-6 text-xs text-slate-500 dark:text-slate-400 font-mono">
                          {moment(record.date).format('YYYY-MM-DD')}
                        </td>
                        <td className="py-4 px-4 sm:px-6 font-semibold text-slate-900 dark:text-slate-100 max-w-[200px] truncate">
                          {record.description || 'Unspecified'}
                        </td>
                        <td className="py-4 px-4 sm:px-6">
                          <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold capitalize bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            {record.category}
                          </span>
                        </td>
                        <td className="py-4 px-4 sm:px-6">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold ${isIncome
                                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                                : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400'
                              }`}
                          >
                            {isIncome ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                            <span className="capitalize">{record.type}</span>
                          </span>
                        </td>
                        <td className={`py-4 px-4 sm:px-6 text-right font-mono font-bold text-sm ${isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-slate-100'}`}>
                          {isIncome ? '+' : '-'}₹{Number(record.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-4 px-4 sm:px-6 text-center">
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

                  {filteredTransactions.length === 0 && !loadingMore && (
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

                  {/* Lazy Loading Skeleton Rows for Desktop Table */}
                  {loadingMore &&
                    Array.from({ length: 3 }).map((_, idx) => (
                      <tr key={`lazy-table-skel-${idx}`} className="transition-colors">
                        <td className="py-4 px-4 sm:px-6">
                          <div className="skeleton-diagonal w-24 h-4 rounded-[4px]" />
                        </td>
                        <td className="py-4 px-4 sm:px-6">
                          <div className="skeleton-diagonal w-40 h-4 rounded-[4px]" />
                        </td>
                        <td className="py-4 px-4 sm:px-6">
                          <div className="skeleton-diagonal w-16 h-5 rounded-[4px]" />
                        </td>
                        <td className="py-4 px-4 sm:px-6">
                          <div className="skeleton-diagonal w-20 h-5 rounded-[4px]" />
                        </td>
                        <td className="py-4 px-4 sm:px-6 text-right">
                          <div className="skeleton-diagonal w-24 h-4 rounded-[4px] ml-auto" />
                        </td>
                        <td className="py-4 px-4 sm:px-6 text-center">
                          <div className="skeleton-diagonal w-16 h-6 rounded-[4px] mx-auto" />
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Lazy Loading Skeleton Cards for Mobile */}
          {loadingMore && (
            <div className="block md:hidden">
              <MobileCardSkeleton count={2} />
            </div>
          )}

          {/* Infinite Scroll Sentinel / Observer Target */}
          <div ref={observerRef} className="h-6 w-full flex items-center justify-center text-xs text-slate-400 py-2">
            {loadingMore ? (
              <span className="text-[11px] text-emerald-500 font-medium animate-pulse">
                Loading more transactions...
              </span>
            ) : hasMore && filteredTransactions.length > 0 ? (
              <span className="text-[10px] text-slate-500 opacity-60">Scroll down for more</span>
            ) : filteredTransactions.length > 0 ? (
              <span className="text-[10px] text-slate-500 opacity-60">All transactions loaded</span>
            ) : null}
          </div>
            </>
          )}
        </div>
      ) : (
        /* Recharts Analytics View */
        <Analytics allTransaction={allTransaction} />
      )}

      {/* Add / Edit Transaction Modal (Touch-friendly & Responsive with max-h and scroll) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md bg-white dark:bg-[#0e1626] rounded-md border border-slate-300 dark:border-slate-700 shadow-xl p-5 sm:p-7 space-y-4 my-auto max-h-[92vh] overflow-y-auto"
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
                    className={`py-2 text-xs font-bold rounded transition-all ${formData.type === 'expense'
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
                    className={`py-2 text-xs font-bold rounded transition-all ${formData.type === 'income'
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
                  Amount (₹)
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="w-full max-w-md bg-white dark:bg-[#0e1626] rounded-md border border-slate-300 dark:border-slate-700 shadow-xl p-5 sm:p-7 space-y-4 my-auto max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Transaction Details</h2>
              <button
                onClick={() => setShowViewModal(false)}
                aria-label="Close details"
                className="p-1 rounded text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5">
              <div className="p-3.5 sm:p-4 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-semibold uppercase">Total Amount</span>
                  <span className={`text-xl sm:text-2xl font-mono font-bold ${viewTransaction.type === 'income' ? 'text-emerald-600' : 'text-slate-900 dark:text-white'}`}>
                    ₹{Number(viewTransaction.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
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
                <p className="p-3 rounded-md bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm text-slate-700 dark:text-slate-300 italic border border-slate-200 dark:border-slate-800 break-words">
                  "{viewTransaction.description || 'No notes provided'}"
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowViewModal(false)}
                className="w-full sm:w-auto px-5 py-2.5 min-h-[40px] text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-[#0e1626] rounded-md border border-slate-300 dark:border-slate-700 shadow-xl p-5 sm:p-6 text-center space-y-4 my-auto">
            <div className="w-12 h-12 rounded-md bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Delete Transaction</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Are you sure you want to delete this record from the database?
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="py-2.5 min-h-[42px] text-xs font-bold rounded-md text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="py-2.5 min-h-[42px] text-xs font-bold rounded-md text-white bg-rose-600 hover:bg-rose-700 shadow-sm transition-all"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onUserUpdated={(updatedUser) => {
          setCurrentUser(updatedUser);
        }}
      />
    </Layout>
  );
};

export default HomePage;
