import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export const SignUpForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    terms: false,
  });
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search);
  const priceId = queryParams.get("plan");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    if (!formData.terms) {
      newErrors.terms = "You must agree to the terms and privacy policy";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    const result = await register(formData);
    
    if (result.success && result.needsVerification) {
      toast.success("Registration successful! Please check your email for verification code.");
      // Navigate to email verification with email and userData in state
      navigate("/auth/verify-email", { 
        state: { 
          email: formData.email, 
          fromSignup: true,
          userData: formData,
          priceId
        } 
      });
    } else if (result.success) {
      toast.success("Registration successful!");
      navigate("/auth/login");
    } else {
      toast.error(result.error || "Registration failed");
      // Set form errors if needed
      if (result.error?.includes("email")) {
        setErrors({ email: result.error });
      } else if (result.error?.includes("password")) {
        setErrors({ password: result.error });
      } else if (result.error?.includes("name")) {
        setErrors({ name: result.error });
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Modern gradient card */}
      <div className="bg-gradient-to-br from-primary via-primary-dark to-green-700 p-5 rounded-3xl shadow-2xl relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-green-600/20"></div>
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-20 translate-x-20"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 -translate-x-16"></div>
        
        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-white/20 backdrop-blur-sm rounded-2xl mb-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-1">Create Account</h2>
            <p className="text-white/80 text-xs">Take control of your denials.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-2">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-white/90">
                Full Name
              </Label>
              <div className="relative">
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`h-12 border-0 rounded-2xl transition-all duration-300 bg-black/40 backdrop-blur-sm text-white placeholder:text-white/60 focus:bg-black/60 focus:ring-2 focus:ring-white/20 ${
                    errors.name 
                      ? "ring-2 ring-red-400" 
                      : ""
                  }`}
                />
              </div>
              {errors.name && (
                <p className="text-red-300 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-white/90">
                Email
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`h-12 border-0 rounded-2xl transition-all duration-300 bg-black/40 backdrop-blur-sm text-white placeholder:text-white/60 focus:bg-black/60 focus:ring-2 focus:ring-white/20 ${
                    errors.email 
                      ? "ring-2 ring-red-400" 
                      : ""
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-300 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-white/90">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`pr-12 h-12 border-0 rounded-2xl transition-all duration-300 bg-black/40 backdrop-blur-sm text-white placeholder:text-white/60 focus:bg-black/60 focus:ring-2 focus:ring-white/20 ${
                    errors.password 
                      ? "ring-2 ring-red-400" 
                      : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/80 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-300 text-sm mt-1">{errors.password}</p>
              )}
              <p className="text-xs text-white/50">
                Min 6 characters
              </p>
            </div>
            </div>

            {/* Terms and Conditions Checkbox */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="terms"
                  name="terms"
                  checked={formData.terms}
                  onChange={handleInputChange}
                  className="mt-1 w-4 h-4 rounded border-white/30 bg-black/40 text-white focus:ring-2 focus:ring-white/20 cursor-pointer"
                />
                <label htmlFor="terms" className="text-xs text-white/70 cursor-pointer">
                  I agree to the{" "}
                  <Link to="/terms-conditions" className="text-white hover:text-white/90 font-medium underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy-policy" className="text-white hover:text-white/90 font-medium underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              {errors.terms && (
                <p className="text-red-300 text-sm">{errors.terms}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-white text-primary hover:bg-primary hover:text-white font-semibold rounded-2xl transition-all duration-300 group shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border-0"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating...
                </div>
              ) : (
                "Create Account"
              )}
            </Button>

          </form>
          
          {/* Sign In Link */}
          <div className="text-center pt-3 border-t border-white/20 mt-3">
            <p className="text-white/80 text-xs">
              Already have an account?{" "}
              <Link 
                to="/auth/login" 
                className="text-white font-semibold hover:underline transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};