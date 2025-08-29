import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { apiService, UsersListResponse, PlansListResponse, PlanRequest } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  ThumbsDown
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

interface AdminStats {
  totalUsers: number;
  totalCases: number;
  totalRevenue: number;
  activeSubscriptions: number;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalCases: 0,
    totalRevenue: 0,
    activeSubscriptions: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingPlan, setIsCreatingPlan] = useState(false);
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
      fetchAdminData();
    }
  }, [user]);

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      // Fetch users, plans, and stats in parallel
      const [usersResponse, plansResponse] = await Promise.all([
        apiService.getAllUsers(1, 50),
        apiService.getAllPlans()
      ]);

      if (usersResponse.success && usersResponse.data) {
        setUsers(usersResponse.data.data);
        setStats(prev => ({
          ...prev,
          totalUsers: usersResponse.data!.totalCount.count
        }));
      }

      if (plansResponse.success && plansResponse.data) {
        setPlans(plansResponse.data.products.data);
      }

      // TODO: Fetch additional stats from backend
      // For now, using placeholder data
      setStats(prev => ({
        ...prev,
        totalCases: 245,
        totalRevenue: 12500,
        activeSubscriptions: 89
      }));

    } catch (error) {
      toast.error('Failed to load admin data');
      console.error('Admin data fetch error:', error);
    } finally {
      setIsLoading(false);
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
        fetchAdminData(); // Refresh data
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
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/8">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="text-primary hover:text-primary-dark hover:bg-primary/5 transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="h-6 border-l border-primary/20" />
              <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-primary text-white">
                <Crown className="w-3 h-3 mr-1" />
                Admin
              </Badge>
              <div className="text-sm text-muted-foreground">
                Welcome, {user?.name}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.totalCases}</div>
              <p className="text-xs text-muted-foreground">
                +18% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{formatCurrency(stats.totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">
                +25% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.activeSubscriptions}</div>
              <p className="text-xs text-muted-foreground">
                +8% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users">Users Management</TabsTrigger>
            <TabsTrigger value="plans">Plans Management</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Users</CardTitle>
                <CardDescription>
                  Manage user accounts and view their subscription status
                </CardDescription>
              </CardHeader>
              <CardContent>
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
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Plans Tab */}
          <TabsContent value="plans" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Subscription Plans</h3>
                <p className="text-sm text-muted-foreground">
                  Create and manage subscription plans
                </p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary-dark">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Plan
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <Card key={plan.id}>
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary mb-2">
                      ${plan.default_price?.unit_amount ? plan.default_price.unit_amount / 100 : 'N/A'}
                      <span className="text-sm text-muted-foreground">
                        /{plan.default_price?.recurring?.interval || 'month'}
                      </span>
                    </div>
                    <Badge variant={plan.active ? "default" : "secondary"}>
                      {plan.active ? "Active" : "Inactive"}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Feedback Analytics</CardTitle>
                  <CardDescription>
                    Track likes and dislikes on AI analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <ThumbsUp className="w-4 h-4 text-green-500" />
                        <span>Positive Feedback</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        78%
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <ThumbsDown className="w-4 h-4 text-red-500" />
                        <span>Negative Feedback</span>
                      </div>
                      <Badge className="bg-red-100 text-red-800">
                        22%
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Monthly Growth</CardTitle>
                  <CardDescription>
                    Platform growth metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>New Users</span>
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="font-semibold">+12%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Revenue Growth</span>
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="font-semibold">+25%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Cases Processed</span>
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="font-semibold">+18%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
