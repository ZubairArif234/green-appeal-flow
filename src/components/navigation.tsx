import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { User, LogOut } from "lucide-react";

export const Navigation = () => {
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src="/logo.png" 
              alt="AI Medical Denial Assistant Logo" 
              className="h-10 w-auto"
              onError={(e) => {
                // Fallback to original design if logo doesn't exist
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                if (fallback) {
                  fallback.classList.remove('hidden');
                  fallback.classList.add('flex');
                }
              }}
            />
            <div className="hidden w-8 h-8 rounded-lg bg-gradient-primary items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">AI</span>
            </div>
           
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-black hover:text-primary transition-smooth font-medium">
              Features
            </a>
            <a href="#how-it-works" className="text-black hover:text-primary transition-smooth font-medium">
              How It Works
            </a>
            <a href="#pricing" className="text-black hover:text-primary transition-smooth font-medium">
              Pricing
            </a>
            <a href="#faq" className="text-black hover:text-primary transition-smooth font-medium">
              FAQ
            </a>
          </div>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="hidden md:flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700 font-medium">{user?.name}</span>
                </div>
                <Button variant="ghost" className="hidden md:inline-flex" asChild>
                  <Link to="/appeal">Appeal Form</Link>
                </Button>
                <Button variant="ghost" className="hidden md:inline-flex" asChild>
                  <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'}>Dashboard</Link>
                </Button>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" className="hidden md:inline-flex" asChild>
                  <Link to="/auth/login">Sign In</Link>
                </Button>
                <Button className="bg-gradient-primary hover:opacity-90 shadow-button transition-smooth" asChild>
                  <Link to="/auth/signup">Free Trial</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
