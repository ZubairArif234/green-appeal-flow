import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { apiService, AdminStatsResponse, UsersListResponse, PlansListResponse, PlanRequest, CaseResponse, TransactionResponse, TransactionsListResponse, AiAnalysesListResponse, AiAnalysisWithDetailsResponse } from '@/services/api';

// Extended interface for AI analysis with additional case fields
interface ExtendedAiAnalysisResponse extends AiAnalysisWithDetailsResponse {
  case: AiAnalysisWithDetailsResponse['case'] & {
    denialText?: string;
    encounterText?: string;
  };
}
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { 
  Users, 
  Plus, 
  Crown, 
  BarChart3, 
  Settings,
  ArrowLeft,
  Loader2,
  Eye,
  Calendar,
  DollarSign,
  TrendingUp,
  FileText,
  ThumbsUp,
  ThumbsDown,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Target,
  Edit,
  Trash2,
  Menu,
  X,
  CheckCircle,
  User,
  Sparkles
} from 'lucide-react';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  isFreeTrialUser: boolean;
  noOfCasesLeft: number;
  planType?: string;
  createdAt: string;
}

type ActivePage = 'dashboard' | 'users' | 'cases' | 'transactions' | 'plans' | 'feedback';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activePage, setActivePage] = useState<ActivePage>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersPage, setUsersPage] = useState(1);
  const [usersTotal, setUsersTotal] = useState(0);
  const [usersSearch, setUsersSearch] = useState('');
  const [cases, setCases] = useState<CaseResponse[]>([]);
  const [casesLoading, setCasesLoading] = useState(false);
  const [casesPage, setCasesPage] = useState(1);
  const [casesTotal, setCasesTotal] = useState(0);
  const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [transactionsPage, setTransactionsPage] = useState(1);
  const [transactionsTotal, setTransactionsTotal] = useState(0);
  const [transactionsSearch, setTransactionsSearch] = useState('');
  const [aiAnalyses, setAiAnalyses] = useState<AiAnalysisWithDetailsResponse[]>([]);
  const [aiAnalysesLoading, setAiAnalysesLoading] = useState(false);
  const [aiAnalysesPage, setAiAnalysesPage] = useState(1);
  const [aiAnalysesTotal, setAiAnalysesTotal] = useState(0);
  const [selectedAnalysis, setSelectedAnalysis] = useState<ExtendedAiAnalysisResponse | null>(null);
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<any | null>(null);
  const [isCaseModalOpen, setIsCaseModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionResponse | null>(null);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [plans, setPlans] = useState<Array<{
    id: string;
    unit_amount: number;
    currency: string;
    recurring: {
      interval: string;
    } | null;
    product: {
      id: string;
      name: string;
      description: string;
      active: boolean;
      metadata?: Record<string, string>;
    };
  }>>([]);
  const [adminStats, setAdminStats] = useState<AdminStatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingPlan, setIsCreatingPlan] = useState(false);
  const [editingPlan, setEditingPlan] = useState<{
    product: { id: string; name: string };
    title: string;
    description: string;
    amount: number;
    currency: string;
    duration?: string;
    type: string;
  } | null>(null);
  const [newPlan, setNewPlan] = useState<PlanRequest>({
    title: '',
    description: '',
    type: '',
    amount: 0,
    currency: 'usd',
    duration: 'month'
  });

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/dashboard');
      toast.error('Access denied. Admin privileges required.');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchDashboardData();
    }
  }, [user]);

  useEffect(() => {
    if (user?.role === 'admin' && activePage === 'feedback') {
      fetchAiAnalyses();
    }
  }, [user, activePage]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      console.log('Fetching admin stats...');
      const statsResponse = await apiService.getAdminStats();
      console.log('Admin stats response:', statsResponse);
      
      if (statsResponse.success && statsResponse.data) {
        console.log('Setting admin stats:', statsResponse.data);
        setAdminStats(statsResponse.data);
      } else {
        console.error('Failed to get admin stats:', statsResponse.error);
        toast.error(statsResponse.error || 'Failed to load dashboard data');
      }
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error('Dashboard data fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async (page: number = 1, search: string = '') => {
    setUsersLoading(true);
    try {
      console.log('Fetching users with page:', page, 'search:', search);
      const usersResponse = await apiService.getAllUsers(page, 10, search);
      console.log('Users response:', usersResponse);

      if (usersResponse.success && usersResponse.data) {
        setUsers(usersResponse.data.data);
        setUsersTotal(usersResponse.data.totalCount.count);
        setUsersPage(page);
        setUsersSearch(search);
      } else {
        console.error('Failed to get users:', usersResponse.error);
        toast.error(usersResponse.error || 'Failed to load users');
      }
    } catch (error) {
      toast.error('Failed to load users');
      console.error('Users fetch error:', error);
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchCases = async (page: number = 1) => {
    setCasesLoading(true);
    try {
      console.log('Fetching cases with page:', page);
      const casesResponse = await apiService.getAllCases(page, 10);
      console.log('Cases response:', casesResponse);
      
      if (casesResponse.success && casesResponse.data) {
        console.log('Cases data received:', casesResponse.data.data);
        console.log('Sample case user:', casesResponse.data.data[0]?.user);
        setCases(casesResponse.data.data);
        setCasesTotal(casesResponse.data.totalCount);
        setCasesPage(page);
      } else {
        console.error('Failed to get cases:', casesResponse.error);
        toast.error(casesResponse.error || 'Failed to load cases');
      }
    } catch (error) {
      toast.error('Failed to load cases');
      console.error('Cases fetch error:', error);
    } finally {
      setCasesLoading(false);
    }
  };

  const fetchTransactions = async (page: number = 1, search: string = '') => {
    setTransactionsLoading(true);
    try {
      console.log('Fetching transactions with page:', page, 'search:', search);
      const transactionsResponse = await apiService.getAllTransactions(page, 10, search);
      console.log('Transactions response:', transactionsResponse);
      
      if (transactionsResponse.success && transactionsResponse.data) {
        setTransactions(transactionsResponse.data.data);
        setTransactionsTotal(transactionsResponse.data.totalCount);
        setTransactionsPage(page);
        setTransactionsSearch(search);
      } else {
        console.error('Failed to get transactions:', transactionsResponse.error);
        toast.error(transactionsResponse.error || 'Failed to load transactions');
      }
    } catch (error) {
      toast.error('Failed to load transactions');
      console.error('Transactions fetch error:', error);
    } finally {
      setTransactionsLoading(false);
    }
  };

  const fetchAiAnalyses = async (page: number = 1) => {
    setAiAnalysesLoading(true);
    try {
      console.log('Fetching AI analyses with page:', page);
      const analysesResponse = await apiService.getAllAiAnalyses(page, 10);
      console.log('AI analyses response:', analysesResponse);
      
      if (analysesResponse.success && analysesResponse.data) {
        setAiAnalyses(analysesResponse.data.data);
        setAiAnalysesTotal(analysesResponse.data.totalCount);
        setAiAnalysesPage(page);
      } else {
        console.error('Failed to get AI analyses:', analysesResponse.error);
        toast.error(analysesResponse.error || 'Failed to load AI analyses');
      }
    } catch (error) {
      toast.error('Failed to load AI analyses');
      console.error('AI analyses fetch error:', error);
    } finally {
      setAiAnalysesLoading(false);
    }
  };

  const fetchPlans = async () => {
    try {
      console.log('Fetching plans...');
      const plansResponse = await apiService.getAllPlans();
      console.log('Plans response:', plansResponse);
      
      if (plansResponse.success && plansResponse.data) {
        console.log('Plans data structure:', plansResponse.data);
        setPlans(plansResponse.data.prices.data);
      } else {
        console.error('Failed to get plans:', plansResponse.error);
        toast.error(plansResponse.error || 'Failed to load plans');
      }
    } catch (error) {
      toast.error('Failed to load plans');
      console.error('Plans fetch error:', error);
    }
  };

  const handlePageChange = async (page: ActivePage) => {
    setActivePage(page);
    
    // Fetch data when switching pages
    if (page === 'users') {
      await fetchUsers(1, '');
    } else if (page === 'cases') {
      await fetchCases(1);
    } else if (page === 'transactions') {
      await fetchTransactions(1, '');
    } else if (page === 'plans' && plans.length === 0) {
      await fetchPlans();
    }
  };

  const handleCreatePlan = async () => {
    if (!newPlan.title || !newPlan.description || !newPlan.amount) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsCreatingPlan(true);
    try {
      const response = await apiService.createPlan(newPlan);
      if (response.success) {
        toast.success('Plan created successfully!');
        setNewPlan({
          title: '',
          description: '',
          type: '',
          amount: 0,
          currency: 'usd',
          duration: 'month'
        });
        fetchPlans(); // Refresh plans
      } else {
        toast.error(response.error || 'Failed to create plan');
      }
    } catch (error) {
      toast.error('Plan creation failed');
      console.error('Plan creation error:', error);
    } finally {
      setIsCreatingPlan(false);
    }
  };

  const handleEditPlan = async () => {
    if (!editingPlan || !editingPlan.title || !editingPlan.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsCreatingPlan(true);
    try {
      const response = await apiService.updatePlan(editingPlan.product.id, {
        title: editingPlan.title,
        description: editingPlan.description,
        type: editingPlan.type,
        amount: editingPlan.amount,
        currency: editingPlan.currency,
        duration: editingPlan.duration
      });
      
      if (response.success) {
        toast.success('Plan updated successfully!');
        setEditingPlan(null);
        fetchPlans(); // Refresh plans
      } else {
        toast.error(response.error || 'Failed to update plan');
      }
    } catch (error) {
      toast.error('Plan update failed');
      console.error('Plan update error:', error);
    } finally {
      setIsCreatingPlan(false);
    }
  };

  const handleDeletePlan = async (planId: string, planName: string) => {
    if (!confirm(`Are you sure you want to delete the plan "${planName}"?`)) {
      return;
    }

    try {
      const response = await apiService.deletePlan(planId);
      if (response.success) {
        toast.success('Plan deleted successfully!');
        fetchPlans(); // Refresh plans
      } else {
        toast.error(response.error || 'Failed to delete plan');
      }
    } catch (error) {
      toast.error('Plan deletion failed');
      console.error('Plan deletion error:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (user?.role !== 'admin') {
    return null; // Will redirect in useEffect
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/8 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 md:flex">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-white via-white to-slate-50/80 shadow-2xl border-r border-slate-200/60 flex flex-col backdrop-blur-sm transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:relative md:z-auto
      `}>
      {/* Header */}
        <div className="p-8 border-b border-gradient-to-r from-transparent via-slate-200/40 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-center space-x-4">
            <div className="relative">
              <img 
                src="/logo.png" 
                alt="Mental Denial Analyzer" 
                className=" h-12 object-contain bg-transparent"
                style={{ 
                  filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))',
                  mixBlendMode: 'multiply'
                }}
                onError={(e) => {
                  // Fallback if logo doesn't load
                  const target = e.currentTarget as HTMLImageElement;
                  const fallback = target.nextElementSibling as HTMLElement;
                  target.style.display = 'none';
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              {/* <div className="w-12 h-12 bg-gradient-to-br from-primary via-primary-dark to-blue-600 rounded-xl shadow-lg items-center justify-center hidden">
                <Crown className="w-7 h-7 text-white" />
              </div> */}
              {/* <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full ring-2 ring-white shadow-sm"></div> */}
            </div>
            {/* <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                Admin Panel
              </h2>
              <p className="text-sm text-slate-500 font-medium">Mental Denial Analyzer</p>
            </div> */}
            </div>
            {/* Mobile Close Button */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-6">
          <div className="mb-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3">Main Menu</p>
          </div>
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => handlePageChange('dashboard')}
                className={`group w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl text-left transition-all duration-200 ${
                  activePage === 'dashboard' 
                    ? 'bg-gradient-to-r from-primary via-primary to-primary-dark text-white shadow-lg shadow-primary/25 scale-[1.02]' 
                    : 'text-slate-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50/50 hover:text-slate-900 hover:shadow-sm'
                }`}
              >
                <div className={`p-1 rounded-lg ${activePage === 'dashboard' ? 'bg-white/20' : 'bg-slate-100 group-hover:bg-white'}`}>
                  <LayoutDashboard className="w-4 h-4" />
                </div>
                <span className="font-medium">Dashboard</span>
                {activePage === 'dashboard' && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                )}
              </button>
            </li>
            <li>
              <button
                onClick={() => handlePageChange('users')}
                className={`group w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl text-left transition-all duration-200 ${
                  activePage === 'users' 
                    ? 'bg-gradient-to-r from-primary via-primary to-primary-dark text-white shadow-lg shadow-primary/25 scale-[1.02]' 
                    : 'text-slate-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50/50 hover:text-slate-900 hover:shadow-sm'
                }`}
              >
                <div className={`p-1 rounded-lg ${activePage === 'users' ? 'bg-white/20' : 'bg-slate-100 group-hover:bg-white'}`}>
                  <Users className="w-4 h-4" />
                </div>
                <span className="font-medium">Users</span>
                {activePage === 'users' && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                )}
              </button>
            </li>
            <li>
              <button
                onClick={() => handlePageChange('cases')}
                className={`group w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl text-left transition-all duration-200 ${
                  activePage === 'cases' 
                    ? 'bg-gradient-to-r from-primary via-primary to-primary-dark text-white shadow-lg shadow-primary/25 scale-[1.02]' 
                    : 'text-slate-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50/50 hover:text-slate-900 hover:shadow-sm'
                }`}
              >
                <div className={`p-1 rounded-lg ${activePage === 'cases' ? 'bg-white/20' : 'bg-slate-100 group-hover:bg-white'}`}>
                  <FileText className="w-4 h-4" />
                </div>
                <span className="font-medium">Submissions</span>
                {activePage === 'cases' && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                )}
              </button>
            </li>
            <li>
              <button
                onClick={() => handlePageChange('transactions')}
                className={`group w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl text-left transition-all duration-200 ${
                  activePage === 'transactions' 
                    ? 'bg-gradient-to-r from-primary via-primary to-primary-dark text-white shadow-lg shadow-primary/25 scale-[1.02]' 
                    : 'text-slate-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50/50 hover:text-slate-900 hover:shadow-sm'
                }`}
              >
                <div className={`p-1 rounded-lg ${activePage === 'transactions' ? 'bg-white/20' : 'bg-slate-100 group-hover:bg-white'}`}>
                  <CreditCard className="w-4 h-4" />
                </div>
                <span className="font-medium">Transactions</span>
                {activePage === 'transactions' && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                )}
              </button>
            </li>
            {/* <li>
              <button
                onClick={() => handlePageChange('plans')}
                className={`group w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl text-left transition-all duration-200 ${
                  activePage === 'plans' 
                    ? 'bg-gradient-to-r from-primary via-primary to-primary-dark text-white shadow-lg shadow-primary/25 scale-[1.02]' 
                    : 'text-slate-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50/50 hover:text-slate-900 hover:shadow-sm'
                }`}
              >
                <div className={`p-1 rounded-lg ${activePage === 'plans' ? 'bg-white/20' : 'bg-slate-100 group-hover:bg-white'}`}>
                  <Settings className="w-4 h-4" />
                </div>
                <span className="font-medium">Plans</span>
                {activePage === 'plans' && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                )}
              </button>
            </li> */}
            <li>
              <button
                onClick={() => handlePageChange('feedback')}
                className={`group w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl text-left transition-all duration-200 ${
                  activePage === 'feedback' 
                    ? 'bg-gradient-to-r from-primary via-primary to-primary-dark text-white shadow-lg shadow-primary/25 scale-[1.02]' 
                    : 'text-slate-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50/50 hover:text-slate-900 hover:shadow-sm'
                }`}
              >
                <div className={`p-1 rounded-lg ${activePage === 'feedback' ? 'bg-white/20' : 'bg-slate-100 group-hover:bg-white'}`}>
                  <ThumbsUp className="w-4 h-4" />
                </div>
                <span className="font-medium">Feedback</span>
                {activePage === 'feedback' && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                )}
              </button>
            </li>
          </ul>
        </nav>

        {/* User Info & Logout */}
        <div className="p-6 border-t border-slate-200/60">
          <div className="bg-gradient-to-r from-slate-50 to-blue-50/30 rounded-2xl p-4 mb-4">
            <div className="flex items-center space-x-4 mb-4">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-primary via-primary-dark to-blue-600 rounded-xl shadow-lg flex items-center justify-center ring-2 ring-white">
                  <span className="text-white text-sm font-bold">
                    {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-slate-500 truncate font-medium">{user?.email}</p>
                <div className="flex items-center mt-1">
                  <Crown className="w-3 h-3 text-amber-500 mr-1" />
                  <span className="text-xs text-amber-600 font-semibold">Administrator</span>
                </div>
              </div>
            </div>
              <Button
              variant="outline"
                size="sm"
              onClick={handleLogout}
              className="w-full justify-start bg-white/50 border-slate-200 hover:bg-white hover:border-slate-300 hover:shadow-sm transition-all duration-200"
              >
              <LogOut className="w-4 h-4 mr-2" />
              <span className="font-medium">Sign Out</span>
              </Button>
            </div>
        </div>
      </div>

            {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-white via-white to-slate-50/30 shadow-sm border-b border-slate-200/60 backdrop-blur-sm">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-primary/10 via-primary/5 to-blue-50 rounded-2xl shadow-sm">
                  {activePage === 'dashboard' && <LayoutDashboard className="w-6 h-6 text-primary" />}
                  {activePage === 'users' && <Users className="w-6 h-6 text-primary" />}
                  {activePage === 'cases' && <FileText className="w-6 h-6 text-primary" />}
                  {activePage === 'transactions' && <CreditCard className="w-6 h-6 text-primary" />}
                  {/* {activePage === 'plans' && <Settings className="w-6 h-6 text-primary" />} */}
                  {activePage === 'feedback' && <ThumbsUp className="w-6 h-6 text-primary" />}
              </div>
                <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 bg-clip-text text-transparent capitalize">
  {{
    dashboard: "Dashboard Overview",
    cases: "Submission",
  }[activePage] || activePage}
</h1>

                  <p className="text-slate-500 text-sm font-medium mt-1">
                    {activePage === 'dashboard' && 'Monitor your platform performance and analytics'}
                    {activePage === 'users' && 'Manage user accounts and subscription status'}
                    {activePage === 'cases' && 'View and manage all user case submissions'}
                    {activePage === 'transactions' && 'Track platform transactions and activities'}
                    {/* {activePage === 'plans' && 'Create and manage subscription plans'} */}
                    {activePage === 'feedback' && 'Analyze user feedback and satisfaction metrics'}
                  </p>
            </div>
          </div>

            </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="md:hidden bg-white border-b border-slate-200/60 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold text-slate-800">Admin Panel</h1>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>

        {/* Page Content */}
        <div className="flex-1 p-4 md:p-8 space-y-6 md:space-y-8 w-full min-w-0">
          {/* Dashboard Page */}
          {activePage === 'dashboard' && (
            <div className="space-y-8">
        {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white via-white to-blue-50/30">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-500/5"></div>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                    <CardTitle className="text-sm font-semibold text-slate-600">Total Users</CardTitle>
                    <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl group-hover:scale-110 transition-transform duration-300">
                      <Users className="h-5 w-5 text-blue-600" />
          </div>
            </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      {adminStats?.stats?.totalUsers || 0}
        </div>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      Registered users
                    </p>
                    {/* <div className="flex space-x-2 mt-3">
                      <Button 
                        onClick={fetchDashboardData} 
                        size="sm" 
                        variant="outline"
                        className="text-xs border-slate-200 hover:border-blue-300 hover:bg-blue-50"
                      >
                        Refresh
                      </Button>
                      <Button 
                        onClick={async () => {
                          try {
                            const result = await apiService.testDbContent();
                            console.log('DB Test Result:', result);
                            toast.success('Check console for DB content');
                          } catch (error) {
                            console.error('DB Test Error:', error);
                            toast.error('DB test failed');
                          }
                        }} 
                        size="sm" 
                        variant="secondary"
                        className="text-xs bg-slate-100 hover:bg-slate-200"
                      >
                        Test DB
                      </Button>
      </div> */}
            </CardContent>
          </Card>

                <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white via-white to-emerald-50/30">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-green-500/5"></div>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                    <CardTitle className="text-sm font-semibold text-slate-600">Total Submissions</CardTitle>
                    <div className="p-2 bg-gradient-to-br from-emerald-100 to-green-100 rounded-xl group-hover:scale-110 transition-transform duration-300">
                      <FileText className="h-5 w-5 text-emerald-600" />
                    </div>
            </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                      {adminStats?.stats?.totalCases || 0}
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      Denials Analyzed
              </p>
            </CardContent>
          </Card>

                <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white via-white to-amber-50/30">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-orange-500/5"></div>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                    <CardTitle className="text-sm font-semibold text-slate-600">Customer Feedback</CardTitle>
                    <div className="p-2 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl group-hover:scale-110 transition-transform duration-300">
                      <ThumbsUp className="h-5 w-5 text-amber-600" />
                    </div>
            </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                      {adminStats?.stats?.totalFeedbacks || 0}
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      User Ratings
              </p>
            </CardContent>
          </Card>

                <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white via-white to-purple-50/30">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-violet-500/5"></div>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                    <CardTitle className="text-sm font-semibold text-slate-600">Transactions</CardTitle>
                    <div className="p-2 bg-gradient-to-br from-purple-100 to-violet-100 rounded-xl group-hover:scale-110 transition-transform duration-300">
                      <DollarSign className="h-5 w-5 text-purple-600" />
                    </div>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                      {adminStats?.stats?.totalTransactions || 0}
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      Payment transactions
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Data */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Users */}
          <Card>
                  <CardHeader>
                    <CardTitle>Recent Users</CardTitle>
                    <CardDescription>Latest registered users</CardDescription>
            </CardHeader>
            <CardContent>
                    {adminStats?.recentUsers && adminStats.recentUsers.length > 0 ? (
                      <div className="space-y-3">
                        {adminStats.recentUsers.map((user) => (
                          <div key={user._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-900">{user.name}</p>
                              <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                            <div className="text-right">
                              <Badge variant={user.isFreeTrialUser ? "outline" : "default"}>
                                {user.isFreeTrialUser ? "Free Trial" : user.planType || "Subscribed"}
                              </Badge>
                              <p className="text-xs text-gray-500 mt-1">
                                {formatDate(user.createdAt)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No recent users found</p>
                      </div>
                    )}
            </CardContent>
          </Card>

                {/* Recent Transactions */}
          <Card>
              <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>Latest payment transactions</CardDescription>
            </CardHeader>
            <CardContent>
                    {adminStats?.recentTransactions && adminStats.recentTransactions.length > 0 ? (
                      <div className="space-y-3">
                        {adminStats.recentTransactions.map((transaction) => (
                          <div key={transaction._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-900">
                                {transaction.user.name}
                              </p>
                              <p className="text-sm text-gray-500 truncate max-w-48">
                                {transaction.amountTotal 
                                  ? `$${(transaction.amountTotal / 100).toFixed(2)} ${(transaction.currency || 'USD').toUpperCase()}`
                                  : 'Amount not available'
                                }
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge 
                                variant={transaction.paymentStatus === 'paid' ? "default" : "secondary"}
                                className={transaction.paymentStatus === 'paid' ? "bg-green-600" : ""}
                              >
                                {transaction.type || 'Payment'}
                              </Badge>
                              <p className="text-xs text-gray-500 mt-1">
                                {formatDate(transaction.createdAt)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <CreditCard className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No recent transactions found</p>
                      </div>
                    )}
            </CardContent>
          </Card>
        </div>
            </div>
          )}

                    {/* Users Page */}
          {activePage === 'users' && (
            <div className="space-y-6">
            <Card>
              <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                <CardTitle>All Users</CardTitle>
                <CardDescription>
                  Manage user accounts and view their subscription status
                </CardDescription>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                      <Input
                        placeholder="Search by email..."
                        value={usersSearch}
                        onChange={(e) => setUsersSearch(e.target.value)}
                        className="w-full sm:w-64"
                      />
                      <Button 
                        onClick={() => fetchUsers(1, usersSearch)}
                        disabled={usersLoading}
                      >
                        {usersLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          'Search'
                        )}
                      </Button>
                      {usersSearch && (
                        <Button 
                          variant="outline"
                          onClick={() => {
                            setUsersSearch('');
                            fetchUsers(1, '');
                          }}
                        >
                          Clear
                        </Button>
                      )}
                    </div>
                  </div>
              </CardHeader>
              <CardContent>
                  {usersLoading ? (
                    <div className="text-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                      <p className="text-muted-foreground">Loading users...</p>
                    </div>
                  ) : users.length > 0 ? (
                    <>
                    <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Cases Left</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.isFreeTrialUser ? "outline" : "default"}>
                            {user.isFreeTrialUser ? "Free Trial" : "Subscribed"}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.noOfCasesLeft}</TableCell>
                        <TableCell>{user.planType || "None"}</TableCell>
                        <TableCell>{formatDate(user.createdAt)}</TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user);
                              setIsUserModalOpen(true);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                    </div>
                      
                      {/* Pagination */}
                      <div className="flex flex-col sm:flex-row items-center justify-between mt-6 space-y-2 sm:space-y-0">
                        <div className="text-sm text-muted-foreground text-center sm:text-left">
                          Showing {((usersPage - 1) * 10) + 1} to {Math.min(usersPage * 10, usersTotal)} of {usersTotal} users
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fetchUsers(usersPage - 1, usersSearch)}
                            disabled={usersPage <= 1 || usersLoading}
                          >
                            Previous
                          </Button>
                          <span className="text-sm">
                            Page {usersPage} of {Math.ceil(usersTotal / 10)}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fetchUsers(usersPage + 1, usersSearch)}
                            disabled={usersPage >= Math.ceil(usersTotal / 10) || usersLoading}
                          >
                            Next
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>{usersSearch ? 'No users found matching your search' : 'No users found'}</p>
                      {!usersSearch && (
                        <Button onClick={() => fetchUsers(1, '')} variant="outline" className="mt-2">
                          <Loader2 className="w-4 h-4 mr-2" />
                          Load Users
                        </Button>
                      )}
                    </div>
                  )}
              </CardContent>
            </Card>
            </div>
          )}

          {/* Cases Page */}
          {activePage === 'cases' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>All Submission</CardTitle>
                  <CardDescription>
                    View and manage all user submissions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {casesLoading ? (
                    <div className="text-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                      <p className="text-muted-foreground">Loading cases...</p>
                    </div>
                  ) : cases.length > 0 ? (
                    <>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Current Claim</TableHead>
                            <TableHead>Previous Claim DOS</TableHead>
                            <TableHead>Previous Claim CPT</TableHead>
                            <TableHead>Primary Payer</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {cases.map((caseItem) => (
                            <TableRow key={caseItem._id}>
                              <TableCell className="font-medium">
                                {typeof caseItem.user === 'object' ? caseItem.user.name : 'Unknown User'}
                                <div className="text-xs text-gray-500">
                                  {typeof caseItem.user === 'object' ? caseItem.user.email : ''}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="max-w-48 truncate">
                                  {caseItem.case.currentClaim}
                                </div>
                              </TableCell>
                              <TableCell>{caseItem.case.previousClaimDOS || 'Not provided'}</TableCell>
                              <TableCell>{caseItem.case.previousClaimCPT || 'Not provided'}</TableCell>
                              <TableCell>{caseItem.case.primaryPayer || 'N/A'}</TableCell>
                              <TableCell>{formatDate(caseItem.case.createdAt)}</TableCell>
                              <TableCell>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => {
                                    setSelectedCase(caseItem);
                                    setIsCaseModalOpen(true);
                                  }}
                                >
                                  <Eye className="w-4 h-4" />
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                      
                      {/* Pagination */}
                      <div className="flex items-center justify-between mt-6">
                        <div className="text-sm text-muted-foreground">
                          Showing {((casesPage - 1) * 10) + 1} to {Math.min(casesPage * 10, casesTotal)} of {casesTotal} cases
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fetchCases(casesPage - 1)}
                            disabled={casesPage <= 1 || casesLoading}
                          >
                            Previous
                          </Button>
                          <span className="text-sm">
                            Page {casesPage} of {Math.ceil(casesTotal / 10)}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fetchCases(casesPage + 1)}
                            disabled={casesPage >= Math.ceil(casesTotal / 10) || casesLoading}
                          >
                            Next
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No cases found</p>
                      <Button onClick={() => fetchCases(1)} variant="outline" className="mt-2">
                        <Loader2 className="w-4 h-4 mr-2" />
                        Load Cases
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Transactions Page */}
          {activePage === 'transactions' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                      <CardTitle>All Transactions</CardTitle>
                      <CardDescription>
                        View case submissions as transaction history
                      </CardDescription>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                      <Input
                        placeholder="Search by user email..."
                        value={transactionsSearch}
                        onChange={(e) => setTransactionsSearch(e.target.value)}
                        className="w-full sm:w-64"
                      />
                      <Button 
                        onClick={() => fetchTransactions(1, transactionsSearch)}
                        disabled={transactionsLoading}
                      >
                        {transactionsLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          'Search'
                        )}
                      </Button>
                      {transactionsSearch && (
                        <Button 
                          variant="outline"
                          onClick={() => {
                            setTransactionsSearch('');
                            fetchTransactions(1, '');
                          }}
                        >
                          Clear
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {transactionsLoading ? (
                    <div className="text-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                      <p className="text-muted-foreground">Loading transactions...</p>
                    </div>
                  ) : transactions.length > 0 ? (
                    <>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Transaction ID</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {transactions.map((transaction) => (
                            <TableRow key={transaction._id}>
                              <TableCell className="font-mono text-sm">
                                {transaction.stripeSessionId ? transaction.stripeSessionId.slice(-8) : transaction._id.slice(-8)}
                              </TableCell>
                              <TableCell className="font-medium">
                                {typeof transaction.user === 'object' ? transaction.user.name : 'Unknown User'}
                              </TableCell>
                              <TableCell>{typeof transaction.user === 'object' ? transaction.user.email : ''}</TableCell>
                              <TableCell>
                                <Badge variant="default">
                                  {transaction.type || 'Payment'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="max-w-48 truncate">
                                  {transaction.amountTotal ? `$${(transaction.amountTotal / 100).toFixed(2)} ${(transaction.currency || 'USD').toUpperCase()}` : 'N/A'}
                                </div>
                              </TableCell>
                              <TableCell>{formatDate(transaction.createdAt)}</TableCell>
                              <TableCell>
                                <Badge 
                                  variant="outline" 
                                  className={
                                    transaction.paymentStatus === 'paid' 
                                      ? "text-green-600 border-green-600" 
                                      : transaction.paymentStatus === 'pending'
                                      ? "text-yellow-600 border-yellow-600"
                                      : "text-red-600 border-red-600"
                                  }
                                >
                                  {transaction.paymentStatus || 'Unknown'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => {
                                    setSelectedTransaction(transaction);
                                    setIsTransactionModalOpen(true);
                                  }}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                      
                      {/* Pagination */}
                      <div className="flex items-center justify-between mt-6">
                        <div className="text-sm text-muted-foreground">
                          Showing {((transactionsPage - 1) * 10) + 1} to {Math.min(transactionsPage * 10, transactionsTotal)} of {transactionsTotal} transactions
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fetchTransactions(transactionsPage - 1, transactionsSearch)}
                            disabled={transactionsPage <= 1 || transactionsLoading}
                          >
                            Previous
                          </Button>
                          <span className="text-sm">
                            Page {transactionsPage} of {Math.ceil(transactionsTotal / 10)}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fetchTransactions(transactionsPage + 1, transactionsSearch)}
                            disabled={transactionsPage >= Math.ceil(transactionsTotal / 10) || transactionsLoading}
                          >
                            Next
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <CreditCard className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>{transactionsSearch ? 'No transactions found matching your search' : 'No transactions found'}</p>
                      {!transactionsSearch && (
                        <Button onClick={() => fetchTransactions(1, '')} variant="outline" className="mt-2">
                          <Loader2 className="w-4 h-4 mr-2" />
                          Load Transactions
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Feedback Page */}
          {activePage === 'feedback' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-br from-primary/10 via-primary/5 to-primary/20 rounded-2xl shadow-sm">
                      <ThumbsUp className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold">AI Analysis Feedback</CardTitle>
                      <CardDescription>User feedback on AI responses and analysis details</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {aiAnalysesLoading ? (
                    <div className="text-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                      <p className="text-muted-foreground">Loading AI analyses...</p>
                    </div>
                  ) : aiAnalyses.length > 0 ? (
                    <>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Current Claim</TableHead>
                            <TableHead>Positive Feedback</TableHead>
                            <TableHead>Negative Feedback</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {aiAnalyses.map((analysis) => (
                            <TableRow key={analysis._id}>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{analysis.user.name}</div>
                                  <div className="text-sm text-muted-foreground">{analysis.user.email}</div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="max-w-xs">
                                  <div className="text-sm font-medium truncate">{analysis.case.currentClaim}</div>
                                  <div className="text-xs text-muted-foreground">
                                    DOS: {analysis.case.previousClaimDOS ? new Date(analysis.case.previousClaimDOS).toLocaleDateString() : 'Not provided'}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <ThumbsUp className="w-4 h-4 text-emerald-600" />
                                  <span className="font-medium text-emerald-600">{analysis.likes.length}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <ThumbsDown className="w-4 h-4 text-red-600" />
                                  <span className="font-medium text-red-600">{analysis.dislikes.length}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  {new Date(analysis.createdAt).toLocaleDateString()}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedAnalysis(analysis as ExtendedAiAnalysisResponse);
                                    setIsAnalysisModalOpen(true);
                                  }}
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                      {/* Pagination */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="text-sm text-muted-foreground">
                          Showing {((aiAnalysesPage - 1) * 10) + 1} to {Math.min(aiAnalysesPage * 10, aiAnalysesTotal)} of {aiAnalysesTotal} analyses
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fetchAiAnalyses(aiAnalysesPage - 1)}
                            disabled={aiAnalysesPage <= 1 || aiAnalysesLoading}
                          >
                            Previous
                          </Button>
                          <span className="text-sm">
                            Page {aiAnalysesPage} of {Math.ceil(aiAnalysesTotal / 10)}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fetchAiAnalyses(aiAnalysesPage + 1)}
                            disabled={aiAnalysesPage >= Math.ceil(aiAnalysesTotal / 10) || aiAnalysesLoading}
                          >
                            Next
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <ThumbsUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No AI analyses found</p>
                      <Button onClick={() => fetchAiAnalyses(1)} variant="outline" className="mt-2">
                        <Loader2 className="w-4 h-4 mr-2" />
                        Reload Analyses
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Plans Page */}
          {/* {activePage === 'plans' && (
            <div className="space-y-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-primary/10 via-primary/5 to-indigo-50 rounded-2xl shadow-sm">
                  <Settings className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                    Subscription Plans
                  </h3>
                  <p className="text-slate-500 font-medium mt-1">
                    Create and manage premium subscription offerings
                  </p>
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="group bg-gradient-to-r from-primary via-primary to-primary-dark text-white shadow-lg hover:shadow-xl border-0 hover:scale-105 transition-all duration-300">
                    <div className="p-1 bg-white/20 rounded-lg mr-2 group-hover:bg-white/30 transition-all duration-300">
                      <Plus className="w-4 h-4" />
                    </div>
                    <span className="font-medium">Create Premium Plan</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Create New Plan</DialogTitle>
                    <DialogDescription>
                      Add a new subscription plan to your platform
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Plan Name</Label>
                      <Input
                        id="title"
                        value={newPlan.title}
                        onChange={(e) => setNewPlan(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g., Pro Plan"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newPlan.description}
                        onChange={(e) => setNewPlan(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe the plan features..."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="amount">Price ($)</Label>
                        <Input
                          id="amount"
                          type="number"
                          value={newPlan.amount}
                          onChange={(e) => setNewPlan(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                          placeholder="29.99"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="duration">Billing</Label>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          value={newPlan.duration}
                          onChange={(e) => setNewPlan(prev => ({ ...prev, duration: e.target.value }))}
                        >
                          <option value="month">Monthly</option>
                          <option value="year">Yearly</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Plan Type</Label>
                      <Input
                        id="type"
                        value={newPlan.type}
                        onChange={(e) => setNewPlan(prev => ({ ...prev, type: e.target.value }))}
                        placeholder="e.g., pro, basic, enterprise"
                      />
                    </div>
                  </div>
                  <Button 
                    onClick={handleCreatePlan}
                    disabled={isCreatingPlan}
                    className="w-full"
                  >
                    {isCreatingPlan ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create Plan'
                    )}
                  </Button>
                </DialogContent>
              </Dialog>
              
              <Dialog open={!!editingPlan} onOpenChange={() => setEditingPlan(null)}>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Edit Plan</DialogTitle>
                    <DialogDescription>
                      Update the plan details
                    </DialogDescription>
                  </DialogHeader>
                  {editingPlan && (
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-title">Plan Name</Label>
                        <Input
                          id="edit-title"
                          value={editingPlan.title}
                          onChange={(e) => setEditingPlan(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="e.g., Pro Plan"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-description">Description</Label>
                        <Textarea
                          id="edit-description"
                          value={editingPlan.description}
                          onChange={(e) => setEditingPlan(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Describe the plan features..."
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-amount">Price ($)</Label>
                          <Input
                            id="edit-amount"
                            type="number"
                            value={editingPlan.amount}
                            onChange={(e) => setEditingPlan(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                            placeholder="29.99"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-duration">Billing</Label>
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={editingPlan.duration}
                            onChange={(e) => setEditingPlan(prev => ({ ...prev, duration: e.target.value }))}
                          >
                            <option value="month">Monthly</option>
                            <option value="year">Yearly</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-type">Plan Type</Label>
                        <Input
                          id="edit-type"
                          value={editingPlan.type}
                          onChange={(e) => setEditingPlan(prev => ({ ...prev, type: e.target.value }))}
                          placeholder="e.g., pro, basic, enterprise"
                        />
                      </div>
                    </div>
                  )}
                  <Button 
                    onClick={handleEditPlan}
                    disabled={isCreatingPlan}
                    className="w-full"
                  >
                    {isCreatingPlan ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      'Update Plan'
                    )}
                  </Button>
                </DialogContent>
              </Dialog>
            </div>

                            {plans?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {plans?.map((plan, index) => (
                <Card key={plan?.id} className={`group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 ${
                  index === 0 ? 'bg-gradient-to-br from-white via-white to-blue-50/30' : 
                  index === 1 ? 'bg-gradient-to-br from-white via-white to-emerald-50/30' :
                  'bg-gradient-to-br from-white via-white to-purple-50/30'
                }`}>
                  <div className={`absolute inset-0 ${
                    index === 0 ? 'bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-500/5' :
                    index === 1 ? 'bg-gradient-to-br from-emerald-500/5 via-transparent to-green-500/5' :
                    'bg-gradient-to-br from-purple-500/5 via-transparent to-violet-500/5'
                  }`}></div>
                  
                  {index === 1 && (
                    <div className="absolute -top-3 -right-3 bg-gradient-to-r from-amber-400 to-orange-400 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg transform rotate-12">
                      POPULAR
                    </div>
                  )}
                  
                  <CardHeader className="relative z-10 pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-2 rounded-xl shadow-sm ${
                        index === 0 ? 'bg-gradient-to-br from-blue-100 to-indigo-100' :
                        index === 1 ? 'bg-gradient-to-br from-emerald-100 to-green-100' :
                        'bg-gradient-to-br from-purple-100 to-violet-100'
                      }`}>
                        <Crown className={`w-5 h-5 ${
                          index === 0 ? 'text-blue-600' :
                          index === 1 ? 'text-emerald-600' :
                          'text-purple-600'
                        }`} />
                      </div>
                      <Badge variant={plan?.product?.active ? "default" : "secondary"} className={`${
                        plan?.product?.active 
                          ? 'bg-gradient-to-r from-emerald-400 to-emerald-500 text-white border-0' 
                          : 'bg-slate-100 text-slate-600'
                      } shadow-sm`}>
                        {plan?.product?.active ? "Active" : "Inactive"}
                    </Badge>
            </div>
                    <CardTitle className={`text-xl font-bold ${
                      index === 0 ? 'bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent' :
                      index === 1 ? 'bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent' :
                      'bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent'
                    }`}>
                      {plan?.product?.name}
                    </CardTitle>
                    <CardDescription className="text-slate-500 font-medium line-clamp-2">
                      {plan?.product?.description}
                  </CardDescription>
                </CardHeader>
                  
                  <CardContent className="relative z-10 pt-0">
                    <div className="mb-6">
                      <div className={`text-4xl font-bold ${
                        index === 0 ? 'bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent' :
                        index === 1 ? 'bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent' :
                        'bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent'
                      }`}>
                        ${plan?.unit_amount / 100}
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm text-slate-500 font-medium">
                          per {plan?.recurring?.interval || 'month'}
                        </span>
                        <span className="text-xs text-slate-400 uppercase font-semibold">
                          {plan?.currency}
                        </span>
                    </div>
                      </div>
                    
                    <div className="space-y-3">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingPlan({
                            ...plan,
                            title: plan.product.name,
                            description: plan.product.description,
                            amount: plan.unit_amount / 100,
                            currency: plan.currency,
                            duration: plan.recurring?.interval || 'month',
                            type: plan.product.metadata?.tier || ''
                          })}
                          className={`flex-1 border-slate-200 hover:border-primary/30 hover:bg-primary/5 transition-all duration-200 ${
                            index === 0 ? 'hover:text-blue-600' :
                            index === 1 ? 'hover:text-emerald-600' :
                            'hover:text-purple-600'
                          }`}
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeletePlan(plan.product.id, plan.product.name)}
                          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 border-0 shadow-sm hover:shadow-md transition-all duration-200"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Delete
                        </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
                  ))}
                      </div>
              ) : (
                <div className="text-center py-16">
                  <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                      <Settings className="w-12 h-12 text-slate-400" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg">
                      <Plus className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  <h3 className="text-xl font-bold text-slate-700 mb-2">No Plans Created Yet</h3>
                  <p className="text-slate-500 mb-6 max-w-md mx-auto">
                    Start by creating your first subscription plan to offer premium services to your users.
                  </p>
                  <Button 
                    onClick={fetchPlans} 
                    variant="outline" 
                    className="bg-gradient-to-r from-white to-slate-50 border-slate-200 hover:border-primary/30 hover:bg-primary/5 transition-all duration-200"
                  >
                    <Loader2 className="w-4 h-4 mr-2" />
                    Load Plans
                  </Button>
                      </div>
              )}
            </div>
          )} */}
        </div>
      </div>

      {/* AI Analysis Details Modal */}
      <Dialog open={isAnalysisModalOpen} onOpenChange={setIsAnalysisModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>AI Analysis Details</DialogTitle>
          <DialogDescription>
            Complete information about this AI analysis and user feedback
          </DialogDescription>
        </DialogHeader>
        
        {selectedAnalysis && (
          <div className="space-y-6">
            {/* User Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">User Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <span className="font-medium">Name:</span> {selectedAnalysis.user.name}
                  </div>
                  <div>
                    <span className="font-medium">Email:</span> {selectedAnalysis.user.email}
                  </div>
                  <div>
                    <span className="font-medium">Analysis Created:</span>{' '}
                    {new Date(selectedAnalysis.createdAt).toLocaleString()}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Case Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <span className="font-medium">Current Claim:</span>{' '}
                    <div className="text-sm mt-1">{selectedAnalysis.case.currentClaim}</div>
                  </div>
                  <div>
                    <span className="font-medium">Previous Claim DOS:</span>{' '}
                    {selectedAnalysis.case.previousClaimDOS ? new Date(selectedAnalysis.case.previousClaimDOS).toLocaleDateString() : 'Not provided'}
                  </div>
                  <div>
                    <span className="font-medium">Previous Claim CPT:</span> {selectedAnalysis.case.previousClaimCPT || 'Not provided'}
                  </div>
                  {selectedAnalysis.case.primaryPayer && (
                    <div>
                      <span className="font-medium">Primary Payer:</span> {selectedAnalysis.case.primaryPayer}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Feedback Summary */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Feedback Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-3 bg-emerald-50 rounded-lg">
                    <ThumbsUp className="w-5 h-5 text-emerald-600" />
                    <div>
                      <div className="font-medium text-emerald-700">Positive Feedback</div>
                      <div className="text-2xl font-bold text-emerald-600">{selectedAnalysis.likes.length}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                    <ThumbsDown className="w-5 h-5 text-red-600" />
                    <div>
                      <div className="font-medium text-red-700">Negative Feedback</div>
                      <div className="text-2xl font-bold text-red-600">{selectedAnalysis.dislikes.length}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

                          {/* AI Analysis Content */}
              <div className="grid grid-cols-1 gap-4">

                {/* Improvements Card */}
                {selectedAnalysis.analysis?.improvements && typeof selectedAnalysis.analysis.improvements === 'object' && Object.keys(selectedAnalysis.analysis.improvements).length > 0 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center space-x-2">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <TrendingUp className="w-5 h-5 text-green-600" />
                        </div>
                        <span>Suggested Improvements</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4">
                        {Object.entries(selectedAnalysis.analysis.improvements).map(([category, details], index) => (
                          <div key={category} className="p-4 bg-green-50 rounded-lg border border-green-200">
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                <span className="text-xs font-bold text-green-600">{index + 1}</span>
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-green-800 mb-2 capitalize">
                                  {category.replace(/([A-Z])/g, ' $1').replace(/[-_]/g, ' ').trim()}
                                </h4>
                                {typeof details === 'object' && details !== null ? (
                                  <div className="space-y-2">
                                    {Object.entries(details as Record<string, unknown>).map(([key, value]) => (
                                      <div key={key} className="bg-white p-3 rounded border border-green-100">
                                        <p className="font-medium text-green-700 text-sm capitalize mb-1">
                                          {key.replace(/([A-Z])/g, ' $1').replace(/[-_]/g, ' ').trim()}:
                                        </p>
                                        <p className="text-sm text-slate-700 leading-relaxed">{String(value)}</p>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-sm text-slate-700 leading-relaxed">{String(details)}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}



                {/* Denial Information Card */}
                {selectedAnalysis.case.denialText && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center space-x-2">
                        <div className="p-2 bg-red-100 rounded-lg">
                          <ThumbsDown className="w-5 h-5 text-red-600" />
                        </div>
                        <span>Denial Information</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                        <p className="text-sm text-slate-700 leading-relaxed">{selectedAnalysis.case.denialText}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Encounter Information Card */}
                {selectedAnalysis.case.encounterText && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center space-x-2">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Users className="w-5 h-5 text-purple-600" />
                        </div>
                        <span>Encounter Information</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <p className="text-sm text-slate-700 leading-relaxed">{selectedAnalysis.case.encounterText}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

               

                {/* Empty State */}
                {(!selectedAnalysis.analysis || Object.keys(selectedAnalysis.analysis).length === 0) && 
                 !selectedAnalysis.case.denialText && !selectedAnalysis.case.encounterText && (
                  <Card>
                    <CardContent className="text-center py-8">
                      <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                      <p className="text-lg font-medium text-gray-600">No Analysis Data Available</p>
                      <p className="text-sm text-gray-500">This case doesn't contain any AI analysis or additional information.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
          </div>
        )}
      </DialogContent>
    </Dialog>

    {/* User Details Modal */}
    <Dialog open={isUserModalOpen} onOpenChange={setIsUserModalOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>Complete user information and account details</DialogDescription>
        </DialogHeader>
        
        {selectedUser && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-medium">Name:</label>
                <p className="text-sm text-muted-foreground">{selectedUser.name}</p>
              </div>
              <div>
                <label className="font-medium">Email:</label>
                <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
              </div>
              <div>
                <label className="font-medium">Role:</label>
                <Badge variant="outline">{selectedUser.role}</Badge>
              </div>
              <div>
                <label className="font-medium">Account Status:</label>
                <Badge variant={selectedUser.isFreeTrialUser ? "outline" : "default"}>
                  {selectedUser.isFreeTrialUser ? "Free Trial" : "Subscribed"}
                </Badge>
              </div>
              <div>
                <label className="font-medium">Cases Left:</label>
                <p className="text-sm text-muted-foreground">{selectedUser.noOfCasesLeft}</p>
              </div>
              <div>
                <label className="font-medium">Plan Type:</label>
                <p className="text-sm text-muted-foreground">{selectedUser.planType || "None"}</p>
              </div>
              <div>
                <label className="font-medium">Joined:</label>
                <p className="text-sm text-muted-foreground">{new Date(selectedUser.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <label className="font-medium">User ID:</label>
                <p className="text-xs font-mono text-muted-foreground">{selectedUser._id}</p>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>

    {/* Case Details Modal */}
      <Dialog open={isCaseModalOpen} onOpenChange={setIsCaseModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Case Details</DialogTitle>
            <DialogDescription>Complete case information and claim details</DialogDescription>
          </DialogHeader>
          
          {selectedCase && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">User Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <span className="font-medium">Name:</span> {typeof selectedCase.user === 'object' ? selectedCase.user.name : 'Unknown User'}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span> {typeof selectedCase.user === 'object' ? selectedCase.user.email : 'N/A'}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Case Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <span className="font-medium">Case ID:</span>
                      <p className="text-xs font-mono">{selectedCase?.case?._id}</p>
                    </div>
                    <div>
                      <span className="font-medium">Created:</span> {new Date(selectedCase?.case?.createdAt).toLocaleString()}
                    </div>
                    <div>
                      <span className="font-medium">Updated:</span> {new Date(selectedCase?.case?.updatedAt).toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Claim Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="font-medium">Current Claim:</span>
                    <p className="text-sm mt-1 p-2 bg-slate-50 rounded">{selectedCase?.case?.currentClaim}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <span className="font-medium">Previous Claim DOS:</span>
                      <p className="text-sm text-gray-500">{selectedCase?.case?.previousClaimDOS || 'Not provided'}</p>
                    </div>
                    <div>
                      <span className="font-medium">Previous Claim CPT:</span>
                      <p className="text-sm text-gray-500">{selectedCase?.case?.previousClaimCPT || 'Not provided'}</p>
                    </div>
                    <div>
                      <span className="font-medium">Primary Payer:</span>
                      <p className="text-sm text-gray-500">{selectedCase?.case?.primaryPayer || 'N/A'}</p>
                    </div>
                  </div>
                  {selectedCase.denialText && (
                    <div>
                      <span className="font-medium">Denial Text:</span>
                      <p className="text-sm mt-1 p-2 bg-red-50 rounded border-l-4 border-red-200">{selectedCase?.case.denialText}</p>
                    </div>
                  )}
                  {selectedCase.encounterText && (
                    <div>
                      <span className="font-medium">Encounter Text:</span>
                      <p className="text-sm mt-1 p-2 bg-blue-50 rounded border-l-4 border-blue-200">{selectedCase?.case.encounterText}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {(selectedCase?.case.denialScreenShots?.length || selectedCase?.case?.encounterScreenShots?.length) && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Screenshots</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {selectedCase?.case.denialScreenShots?.length && (
                      <div>
                        <span className="font-medium">Denial Screenshots ({selectedCase?.case.denialScreenShots.length}):</span>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                          {selectedCase?.case.denialScreenShots.map((screenshot, index) => (
                            <img key={index} src={screenshot} alt={`Denial ${index + 1}`} className="w-full h-24 object-cover rounded border" />
                          ))}
                        </div>
                      </div>
                    )}
                    {selectedCase?.case.encounterScreenShots?.length && (
                      <div>
                        <span className="font-medium">Encounter Screenshots ({selectedCase?.case.encounterScreenShots.length}):</span>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                          {selectedCase?.case.encounterScreenShots.map((screenshot, index) => (
                            <img key={index} src={screenshot} alt={`Encounter ${index + 1}`} className="w-full h-24 object-cover rounded border" />
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Analysis Sections */}
              <div className="lg:col-span-2 space-y-6">
                {/* Recommended Pathway */}
                {selectedCase.analysis?.recommended_pathway && (
                  <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg border-l-4 border-blue-600 bg-gradient-to-r from-blue-50 to-white">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Target className="w-6 h-6 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">Recommended Action</h3>
                    </div>
                    <div className="space-y-4">
                      {selectedCase.analysis.recommended_pathway.type && (
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2 text-blue-600 font-semibold text-lg">
                            <CheckCircle className="w-6 h-6" />
                            <span>{selectedCase.analysis.recommended_pathway.type}</span>
                          </div>
                        </div>
                      )}
                      {selectedCase.analysis.recommended_pathway.instruction && (
                        <div className="p-4 bg-blue-50 rounded-xl border-l-4 border-blue-600">
                          <p className="text-gray-800 leading-relaxed font-medium">
                            {selectedCase.analysis.recommended_pathway.instruction}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Denial Summary */}
                {selectedCase.analysis?.denial_summary && (
                  <div className="bg-gradient-to-r from-orange-50 to-white rounded-2xl p-6 mb-6 shadow-lg border-l-4 border-orange-500">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <FileText className="w-6 h-6 text-red-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">Denial Summary</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-orange-100 border border-gray-200 rounded-xl p-4 text-center">
                        <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Reason Code</div>
                        <div className="text-lg font-bold text-gray-900">
                          {selectedCase.analysis.denial_summary.reason_code || 'N/A'}
                        </div>
                      </div>
                      <div className="bg-orange-100 border border-gray-200 rounded-xl p-4 text-center">
                        <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Remark Code</div>
                        <div className="text-lg font-bold text-gray-900">
                          {selectedCase.analysis.denial_summary.remark_code || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Root Cause Analysis */}
                {selectedCase.analysis?.root_cause_analysis && (
                  <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg border-l-4 border-yellow-500 bg-gradient-to-r from-yellow-50 to-white">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <Target className="w-6 h-6 text-yellow-500" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">Root Cause Analysis</h3>
                    </div>
                    <div className="space-y-4">
                      {selectedCase.analysis.root_cause_analysis.issue_identified && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                          <div className="text-sm font-semibold text-yellow-800 mb-2">Issue Identified:</div>
                          <div className="text-yellow-900 font-medium leading-relaxed">
                            {selectedCase.analysis.root_cause_analysis.issue_identified}
                          </div>
                        </div>
                      )}
                      {selectedCase.analysis.root_cause_analysis.cms_guidelines && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                          <div className="text-sm font-semibold text-yellow-800 mb-2">CMS Guidelines:</div>
                          <div className="text-yellow-900 font-medium leading-relaxed">
                            {selectedCase.analysis.root_cause_analysis.cms_guidelines}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Staff Instructions */}
                {selectedCase.analysis?.staff_instructions && (
                  <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg border-l-4 border-purple-500 bg-gradient-to-r from-purple-50 to-white">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <User className="w-6 h-6 text-purple-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">Staff Instructions</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-purple-50 border border-gray-200 rounded-xl p-4">
                        <div className="text-sm font-semibold text-purple-600 mb-2">
                          {selectedCase.analysis.staff_instructions.instruction_type || 'Submit Corrected Claim'}:
                        </div>
                        <div className="text-purple-800 font-medium leading-relaxed">
                          {selectedCase.analysis.staff_instructions.detail || 'No specific instructions provided'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Provider Education */}
                {selectedCase.analysis?.provider_education && (
                  <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg border-l-4 border-indigo-500 bg-gradient-to-r from-indigo-50 to-white">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 bg-indigo-100 rounded-lg">
                        <Sparkles className="w-6 h-6 text-indigo-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">Provider Education</h3>
                    </div>
                    <div className="space-y-4">
                      {selectedCase.analysis.provider_education.future_prevention && (
                        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                          <div className="text-sm font-semibold text-indigo-800 mb-2">Future Prevention:</div>
                          <div className="text-indigo-900 font-medium leading-relaxed">
                            {selectedCase.analysis.provider_education.future_prevention}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

    {/* Transaction Details Modal */}
    <Dialog open={isTransactionModalOpen} onOpenChange={setIsTransactionModalOpen}>
      <DialogContent className="max-w-3xl max-h-screen overflow-auto">
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
          <DialogDescription>Complete transaction information and payment details</DialogDescription>
        </DialogHeader>
        
        {selectedTransaction && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">User Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <span className="font-medium">Name:</span> {typeof selectedTransaction.user === 'object' ? selectedTransaction.user.name : 'Unknown User'}
                  </div>
                  <div>
                    <span className="font-medium">Email:</span> {typeof selectedTransaction.user === 'object' ? selectedTransaction.user.email : 'N/A'}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Payment Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <span className="font-medium">Amount:</span>
                    <p className="text-lg font-bold text-green-600">
                      {selectedTransaction.amountTotal ? `$${(selectedTransaction.amountTotal / 100).toFixed(2)} ${(selectedTransaction.currency || 'USD').toUpperCase()}` : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Status:</span>
                    <Badge 
                      variant="outline" 
                      className={
                        selectedTransaction.paymentStatus === 'paid' 
                          ? "text-green-600 border-green-600" 
                          : selectedTransaction.paymentStatus === 'pending'
                          ? "text-yellow-600 border-yellow-600"
                          : "text-red-600 border-red-600"
                      }
                    >
                      {selectedTransaction.paymentStatus || 'Unknown'}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium">Type:</span>
                    <Badge variant="default">{selectedTransaction.type || 'Payment'}</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Transaction Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium">Transaction ID:</span>
                    <p className="text-xs font-mono text-muted-foreground">{selectedTransaction._id}</p>
                  </div>
                  {selectedTransaction.stripeSessionId && (
                    <div>
                      <span className="font-medium">Stripe Session ID:</span>
                      <p className="text-xs font-mono text-muted-foreground line-clamp-1">{selectedTransaction.stripeSessionId}</p>
                    </div>
                  )}
                  {selectedTransaction.subscriptionId && (
                    <div>
                      <span className="font-medium">Subscription ID:</span>
                      <p className="text-xs font-mono text-muted-foreground line-clamp-1">{selectedTransaction.subscriptionId}</p>
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Created:</span>
                    <p className="text-sm text-muted-foreground">{new Date(selectedTransaction.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="font-medium">Updated:</span>
                    <p className="text-sm text-muted-foreground">{new Date(selectedTransaction.updatedAt).toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
      </div>
    </div>
  );
};

export default AdminDashboard;