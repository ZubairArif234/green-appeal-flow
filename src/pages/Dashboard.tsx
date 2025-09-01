import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User, Mail, Shield, LogOut, FileText, ArrowRight, Crown, CreditCard, AlertCircle, Eye, Calendar, DollarSign } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { apiService, CaseResponse, TransactionResponse } from "@/services/api";

const Dashboard = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [userCases, setUserCases] = useState<CaseResponse[]>([]);
  const [userTransactions, setUserTransactions] = useState<TransactionResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'user') {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      // Fetch user's cases
      const casesResponse = await apiService.getMyCases();
      if (casesResponse.success && casesResponse.data) {
        setUserCases(casesResponse.data.data.slice(0, 5)); // Show only recent 5 cases
      }
      
      // Note: We'll need to create a getMyTransactions API endpoint
      // For now, we'll leave transactions empty or create a mock
      setUserTransactions([]);
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    navigate("/");
  };

  // Handle case creation - redirect to plans if no cases left
  const handleStartNewCase = () => {
    if (user?.noOfCasesLeft === 0) {
      navigate('/plans');
      toast.info('Please select a plan to continue creating cases.');
    } else {
      navigate('/appeal');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-foreground">Mental Denial Analyzer</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {user?.role === 'admin' && (
                <Badge className="bg-primary text-white">
                  <Crown className="w-3 h-3 mr-1" />
                  Admin
                </Badge>
              )}
              <span className="text-gray-700">Welcome, {user?.name}!</span>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Show Admin Dashboard link for Admins */}
        {user?.role === 'admin' && (
          <div className="mb-6">
            <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Crown className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">Administrator Access</h3>
                      <p className="text-sm text-muted-foreground">Manage users, cases, and platform settings</p>
                    </div>
                  </div>
                  <Link to="/admin">
                    <Button className="bg-primary hover:bg-primary-dark">
                      <Crown className="w-4 h-4 mr-2" />
                      Go to Admin Panel
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* User Profile Card */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Profile Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Name</label>
                <p className="text-lg">{user?.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <p className="text-lg">{user?.email}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email Status</label>
                <div className="flex items-center space-x-2">
                  <Shield className={`w-4 h-4 ${user?.isEmailVerified ? 'text-green-500' : 'text-red-500'}`} />
                  <p className={`text-sm ${user?.isEmailVerified ? 'text-green-600' : 'text-red-600'}`}>
                    {user?.isEmailVerified ? 'Verified' : 'Not Verified'}
                  </p>
                </div>
              </div>
              {user?.role === 'user' && (
                <>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Account Status</label>
                    <div className="flex items-center space-x-2">
                      <CreditCard className="w-4 h-4 text-primary" />
                      <Badge variant={user.isFreeTrialUser ? "outline" : "default"}>
                        {user.isFreeTrialUser ? "Free Trial" : "Subscribed"}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Cases Remaining</label>
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-primary" />
                      <p className="text-lg font-semibold">{user.noOfCasesLeft}</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Main Dashboard Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Welcome Card */}
            <Card>
              <CardHeader>
                <CardTitle>Welcome to Mental Denial Analyzer</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">
                  {user?.role === 'admin' 
                    ? 'Welcome back! Monitor platform activity and manage users from your admin panel.'
                    : 'Ready to appeal a denial? Our AI-powered system will help you analyze your case and identify the best next steps.'
                  }
                </p>
                {user?.role === 'user' && (
                  <Button 
                    onClick={handleStartNewCase}
                    className="bg-primary hover:bg-primary-dark text-primary-foreground font-semibold px-6 py-3 rounded-xl shadow-button hover:shadow-elegant transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    <FileText className="w-5 h-5 mr-2" />
                    Start New Case
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Warning Card for Users with No Cases */}
            {user?.role === 'user' && user.noOfCasesLeft === 0 && (
              <Card className="border-orange-200 bg-orange-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-orange-800">
                    <AlertCircle className="w-5 h-5" />
                    <span>Action Required</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-orange-700 mb-4">
                    You have no cases remaining. Upgrade to a paid plan to continue using our AI-powered denial analysis.
                  </p>
                  <Link to="/plans">
                    <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                      <CreditCard className="w-4 h-4 mr-2" />
                      View Plans
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {user?.role === 'user' && (
                    <>
                      <Button 
                        variant="outline" 
                        onClick={handleStartNewCase}
                        className="h-20 flex flex-col items-center justify-center hover:bg-accent hover:border-primary/30 transition-all duration-200"
                      >
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                          <FileText className="w-4 h-4 text-primary" />
                        </div>
                        <span>New Case</span>
                      </Button>
                      <Link to="/plans">
                        <Button variant="outline" className="h-20 w-full flex flex-col items-center justify-center hover:bg-accent hover:border-primary/30 transition-all duration-200">
                          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                            <CreditCard className="w-4 h-4 text-primary" />
                          </div>
                          <span>View Plans</span>
                        </Button>
                      </Link>
                    </>
                  )}
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center hover:bg-accent hover:border-primary/30 transition-all duration-200">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <span>Profile</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* User Cases and Transactions - Only for regular users */}
        {user?.role === 'user' && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Cases */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Recent Cases</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading cases...</p>
                  </div>
                ) : userCases.length > 0 ? (
                  <div className="space-y-4">
                    {userCases.map((caseItem) => (
                      <div key={caseItem._id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium truncate">{caseItem.currentClaim}</h4>
                          <Badge variant="outline" className="text-xs">
                            {caseItem.primaryPayer || 'N/A'}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {formatDate(caseItem.createdAt)}
                          </span>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <div className="text-center pt-4">
                      <Button variant="outline" size="sm">
                        View All Cases
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No cases found</p>
                    <Button 
                      onClick={handleStartNewCase}
                      variant="outline" 
                      className="mt-2"
                    >
                      Create Your First Case
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5" />
                  <span>Recent Transactions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userTransactions.length > 0 ? (
                  <div className="space-y-4">
                    {userTransactions.map((transaction) => (
                      <div key={transaction._id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <DollarSign className="w-4 h-4 text-green-600" />
                            <span className="font-medium">
                              ${transaction.amountTotal ? (transaction.amountTotal / 100).toFixed(2) : '0.00'}
                            </span>
                          </div>
                          <Badge variant={transaction.paymentStatus === 'paid' ? 'default' : 'secondary'}>
                            {transaction.paymentStatus || 'pending'}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>{transaction.type || 'Payment'}</span>
                          <span>{formatDate(transaction.createdAt)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <CreditCard className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No transactions found</p>
                    <Link to="/plans">
                      <Button variant="outline" className="mt-2">
                        View Plans
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
