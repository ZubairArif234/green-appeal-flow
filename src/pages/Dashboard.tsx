import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Shield, LogOut, FileText, ArrowRight, Crown, CreditCard, AlertCircle, Eye, Calendar, DollarSign, Edit, Settings } from "lucide-react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { apiService, CaseResponse, TransactionResponse, UpdateProfileRequest } from "@/services/api";

const Dashboard = () => {
  const { user, logout, isAuthenticated, updateProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [userCases, setUserCases] = useState<CaseResponse[]>([]);
  const [userTransactions, setUserTransactions] = useState<TransactionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const queryParams = new URLSearchParams(location.search);
  const priceId = queryParams.get("plan");

  const selectPlan = async (priceId) => {
    const response = await apiService.createPaymentSession({
          productId: priceId, // Backend expects 'productId' but we're sending priceId
        });
        if (response.success && response.data?.url) {
          window.location.href = response.data.url;
        } else {
          toast.error("Failed to create payment session");
        }
  }

  useEffect(()=>{
if (priceId !== null){
  selectPlan(priceId)
}
  },[priceId])

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

  // Handle profile editing
  const handleSaveProfile = async () => {
    try {
      const result = await updateProfile({
        name: editingProfile.name,
        // email: editingProfile.email
      });

      if (result.success) {
        toast.success('Profile updated successfully!');
        setIsProfileModalOpen(false);
      } else {
        toast.error(result.error || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleProfileInputChange = (field: string, value: string) => {
    setEditingProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleManageSubscription = async () =>{
    const res = await apiService.manageSubscription() 
    console.log(res);
    if(res.data?.url){

      window.location.href = res.data.url;
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Landing Page Style */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src="/logo.png" 
                alt="Mental Denial Analyzer Logo" 
                className="h-10 w-auto"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                  if (fallback) {
                    fallback.classList.remove('hidden');
                    fallback.classList.add('flex');
                  }
                }}
              />
              <div className="hidden w-10 h-10 rounded-lg bg-primary items-center justify-center">
                <span className="text-white font-bold text-sm">MDA</span>
              </div>
              {/* <h1 className="text-xl font-bold text-black">
                 Denial Analyzer
              </h1> */}
            </div>
            
            <div className="flex items-center space-x-4">
              {user?.role === 'admin' && (
                <Badge className="bg-primary text-white">
                  <Crown className="w-3 h-3 mr-1" />
                  Admin
                </Badge>
              )}
              
              {/* User Profile with Image */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <span className="hidden md:block text-black font-medium">
                  {user?.name}
                </span>
              </div>
              
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2 border-gray-300 hover:border-primary hover:text-primary"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-black mb-2">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-lg text-gray-600">
              {user?.role === 'admin' 
                ? 'Monitor your platform and manage users with powerful admin tools'
                : 'Lets break down your denial and figure out the smartest path forward.'
              }
            </p>
          </div>
        </div>

        {/* Show Admin Dashboard link for Admins */}
        {user?.role === 'admin' && (
          <div className="mb-8">
            <Card className="border shadow-md bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-primary rounded-xl">
                      <Crown className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-black">Administrator Access</h3>
                      <p className="text-gray-600">Manage users, cases, and platform settings</p>
                    </div>
                  </div>
                  <Link to="/admin">
                    <Button className="bg-primary hover:bg-primary/90 text-white">
                      <Crown className="w-4 h-4 mr-2" />
                      Go to Admin Panel
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* User Profile Card */}
          <div className="lg:col-span-1">
            <Card className="border shadow-md bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-3">
                  <div className="p-2 bg-primary rounded-lg">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-black">Profile Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 mx-auto bg-primary rounded-full flex items-center justify-center mb-3">
                      <span className="text-white font-bold text-2xl">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-black">{user?.name}</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <label className="text-sm font-semibold text-gray-700">Email</label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <p className="text-black font-medium">{user?.email}</p>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <label className="text-sm font-semibold text-green-700">Email Status</label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Shield className={`w-4 h-4 ${user?.isEmailVerified ? 'text-green-600' : 'text-gray-500'}`} />
                        <div className={`w-2 h-2 ${user?.isEmailVerified ? 'bg-green-600' : 'bg-gray-400'} rounded-full`}></div>
                        <span className="text-green-700 font-medium">
                          {user?.isEmailVerified ? 'Verified' : 'Not Verified'}
                        </span>
                      </div>
                    </div>
                    
                    {user?.role === 'user' && (
                      <>
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <label className="text-sm font-semibold text-gray-700">Account Status</label>
                          <div className="flex items-center space-x-2 mt-1">
                            <CreditCard className="w-4 h-4 text-gray-600" />
                            <Badge className={`${
                              user.isFreeTrialUser 
                                ? "bg-gray-600" 
                                :user?.subscriptionId ? "bg-primary": "bg-red-500"
                            } text-white`}>
                              {user.isFreeTrialUser ? "Free Trial" : user?.subscriptionId ? "Subscribed" : "Not subscribed"}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                          <label className="text-sm font-semibold text-green-700">Claim Remaining</label>
                          <div className="flex items-center space-x-2 mt-1">
                            <FileText className="w-4 h-4 text-green-600" />
                            <span className="text-green-700 font-bold text-lg">{user.noOfCasesLeft}</span>
                          </div>
                        </div>
{user?.subscriptionId && (

                        <div className="p-3 flex justify-center ">
                          <Button 
                    onClick={handleManageSubscription}
                    className="bg-primary capitalize hover:bg-primary/90 text-white font-semibold px-8 py-4 rounded-xl"
                  >
                    <FileText className="w-5 h-5 " />
                    Manage Subscription
                    {/* <ArrowRight className="w-4 h-4 ml-3" /> */}
                  </Button>
                        </div>
)}
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Welcome Card */}
            <Card className="border shadow-md bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl capitalize font-bold text-black">
                  Let's get started
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                  {user?.role === 'admin' 
                    ? 'Welcome back! Monitor platform activity and manage users from your admin panel.'
                    : 'Upload your denial details to receive suggested claim corrections or a draft appeal letter.'
                  }
                </p>
                {user?.role === 'user' && (
                  <Button 
                    onClick={handleStartNewCase}
                    className="bg-primary capitalize hover:bg-primary/90 text-white font-semibold px-8 py-4 rounded-xl"
                  >
                    <FileText className="w-5 h-5 mr-3" />
                    Start a new analysis
                    <ArrowRight className="w-4 h-4 ml-3" />
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Warning Card for Users with No Cases */}
            {user?.role === 'user' && user.noOfCasesLeft === 0 && (
              <Card className="border-gray-300 bg-gray-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-black">
                    <AlertCircle className="w-5 h-5" />
                    <span>Action Required</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    You have no cases remaining. Upgrade to a paid plan to continue using our AI-powered denial analysis.
                  </p>
                  <Link to="/plans">
                    <Button className="bg-primary hover:bg-primary/90 text-white">
                      <CreditCard className="w-4 h-4 mr-2" />
                      View Plans
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card className="border shadow-md bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-black">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {user?.role === 'user' && (
                    <>
                      <Button 
                        variant="outline" 
                        onClick={handleStartNewCase}
                        className="h-24 flex flex-col items-center justify-center border border-green-200 bg-green-50 hover:bg-green-100"
                      >
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center mb-2">
                          <FileText className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-semibold text-black text-[12px]">New Analysis</span>
                      </Button>
                      <Link to="/history">
                        <Button variant="outline" className="h-24 w-full flex flex-col items-center justify-center border border-gray-200 bg-gray-50 hover:bg-gray-100">
                          <div className="w-10 h-10 bg-gray-600 rounded-xl flex items-center justify-center mb-2">
                            <CreditCard className="w-5 h-5 text-white" />
                          </div>
                          <span className="font-semibold text-black text-[12px]">View Past Claims</span>
                        </Button>
                      </Link>
                      {/* <Link to="/plans">
                        <Button variant="outline" className="h-24 w-full flex flex-col items-center justify-center border border-gray-200 bg-gray-50 hover:bg-gray-100">
                          <div className="w-10 h-10 bg-gray-600 rounded-xl flex items-center justify-center mb-2">
                            <CreditCard className="w-5 h-5 text-white" />
                          </div>
                          <span className="font-semibold text-black text-[12px]">Manage Subscription</span>
                        </Button>
                      </Link> */}
                      <Link to="/plans">
                        <Button variant="outline" className="h-24 w-full flex flex-col items-center justify-center border border-gray-200 bg-gray-50 hover:bg-gray-100">
                          <div className="w-10 h-10 bg-gray-600 rounded-xl flex items-center justify-center mb-2">
                            <CreditCard className="w-5 h-5 text-white" />
                          </div>
                          <span className="font-semibold text-black text-[12px] ">View Plans</span>
                        </Button>
                      </Link>
                    </>
                  )}
                  
                  {/* Profile Edit Dialog */}
                  <Dialog open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="h-24 flex flex-col items-center justify-center border border-green-200 bg-green-50 hover:bg-green-100"
                        onClick={() => {
                          setEditingProfile({
                            name: user?.name || '',
                            email: user?.email || ''
                          });
                        }}
                      >
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center mb-2">
                          <Edit className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-semibold text-black text-[12px]">Edit Profile</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] bg-white">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-black">
                          Edit Profile
                        </DialogTitle>
                        <DialogDescription className="text-gray-600">
                          Make changes to your profile here. Click save when you're done.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right font-semibold text-black">
                            Name
                          </Label>
                          <Input
                            id="name"
                            value={editingProfile.name}
                            onChange={(e) => handleProfileInputChange('name', e.target.value)}
                            className="col-span-3 border-gray-300"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="email" className="text-right font-semibold text-black">
                            Email
                          </Label>
                          <Input
                            id="email"
                            readOnly
                            disabled
                            type="email"
                            value={editingProfile.email}
                            onChange={(e) => handleProfileInputChange('email', e.target.value)}
                            className="col-span-3 border-gray-300"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsProfileModalOpen(false)} className="border-gray-300">
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleSaveProfile}
                          className="bg-primary hover:bg-primary/90 text-white"
                        >
                          Save changes
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* User Cases and Transactions - Only for regular users */}
        {/* {user?.role === 'user' && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
           
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
        )} */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
