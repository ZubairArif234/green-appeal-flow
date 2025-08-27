import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Shield, LogOut, FileText, ArrowRight } from "lucide-react";
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

  // No need to check authentication here since ProtectedRoute handles it

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-primary/5">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-primary">Mental Denial Analyzer</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user.name}!</span>
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
                  <Shield className={`w-4 h-4 ${user.isEmailVerified ? 'text-green-500' : 'text-red-500'}`} />
                  <p className={`text-sm ${user.isEmailVerified ? 'text-green-600' : 'text-red-600'}`}>
                    {user.isEmailVerified ? 'Verified' : 'Not Verified'}
                  </p>
                </div>
              </div>
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
              <Link to="/appeal">
                <Button className="bg-gradient-to-r from-primary via-green-600 to-primary-dark hover:from-primary-dark hover:via-green-700 hover:to-primary text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
                  <FileText className="w-5 h-5 mr-2" />
                  Start New Appeal
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card className="col-span-1 md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Link to="/appeal">
                  <Button variant="outline" className="h-20 w-full flex flex-col items-center justify-center hover:bg-primary/5 hover:border-primary/30 transition-all duration-200">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                      <FileText className="w-4 h-4 text-primary" />
                    </div>
                    <span>New Appeal</span>
                  </Button>
                </Link>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center hover:bg-primary/5 hover:border-primary/30 transition-all duration-200">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <span>Update Profile</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center hover:bg-primary/5 hover:border-primary/30 transition-all duration-200">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                    <Shield className="w-4 h-4 text-primary" />
                  </div>
                  <span>Security Settings</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center hover:bg-primary/5 hover:border-primary/30 transition-all duration-200">
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
