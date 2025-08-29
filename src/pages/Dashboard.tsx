import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Shield, LogOut, FileText, ArrowRight, Crown, CreditCard, AlertCircle } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";

const Dashboard = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* User Profile Card */}
          <Card className="col-span-1 md:col-span-2 lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Profile Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Name</label>
                <p className="text-lg">{user.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <p className="text-lg">{user.email}</p>
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

          {/* Welcome Card */}
          <Card className="col-span-1 md:col-span-2">
            <CardHeader>
              <CardTitle>Welcome to Mental Denial Analyzer</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Ready to appeal a denial? Our AI-powered system will help you analyze your case and identify the best next steps.
              </p>
              <Button 
                onClick={handleStartNewCase}
                className="bg-primary hover:bg-primary-dark text-primary-foreground font-semibold px-6 py-3 rounded-xl shadow-button hover:shadow-elegant transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <FileText className="w-5 h-5 mr-2" />
                Start New Case
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Warning Card for Users with No Cases */}
          {user?.role === 'user' && user.noOfCasesLeft === 0 && (
            <Card className="col-span-1 md:col-span-2 lg:col-span-3 border-orange-200 bg-orange-50">
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

          {/* Quick Actions Card */}
          <Card className="col-span-1 md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {user?.role === 'user' && (
                  <>
                    <Button 
                      variant="outline" 
                      onClick={handleStartNewCase}
                      className="h-20 w-full flex flex-col items-center justify-center hover:bg-accent hover:border-primary/30 transition-all duration-200"
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
                
                {user?.role === 'admin' && (
                  <>
                    <Link to="/admin">
                      <Button variant="outline" className="h-20 w-full flex flex-col items-center justify-center hover:bg-accent hover:border-primary/30 transition-all duration-200">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                          <Crown className="w-4 h-4 text-primary" />
                        </div>
                        <span>Admin Panel</span>
                      </Button>
                    </Link>
                    <Link to="/appeal">
                      <Button variant="outline" className="h-20 w-full flex flex-col items-center justify-center hover:bg-accent hover:border-primary/30 transition-all duration-200">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                          <FileText className="w-4 h-4 text-primary" />
                        </div>
                        <span>Test Case</span>
                      </Button>
                    </Link>
                  </>
                )}
                
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center hover:bg-accent hover:border-primary/30 transition-all duration-200">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <span>Update Profile</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center hover:bg-accent hover:border-primary/30 transition-all duration-200">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                    <Shield className="w-4 h-4 text-primary" />
                  </div>
                  <span>Security Settings</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center hover:bg-accent hover:border-primary/30 transition-all duration-200">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                    <Mail className="w-4 h-4 text-primary" />
                  </div>
                  <span>Notifications</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
