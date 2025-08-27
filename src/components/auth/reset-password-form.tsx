import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Eye, EyeOff, Mail, Lock, ArrowRight, KeyRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

type Step = "email" | "otp" | "newPassword";

export const ResetPasswordForm = () => {
  const [currentStep, setCurrentStep] = useState<Step>("email");
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { forgotPassword, resetPassword, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleOtpChange = (value: string) => {
    setFormData(prev => ({ ...prev, otp: value }));
    setErrors(prev => ({ ...prev, otp: "" }));
  };

  const validateEmail = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateOtp = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.otp || formData.otp.length !== 6) {
      newErrors.otp = "Please enter the complete 6-digit code";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateNewPassword = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail()) return;
    
    const result = await forgotPassword(formData.email);
    
    if (result.success) {
      toast.success("Reset code sent to your email!");
      setCurrentStep("otp");
    } else {
      toast.error(result.error || "Failed to send reset email");
      setErrors({ email: result.error || "Failed to send reset email" });
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateOtp()) return;
    
    // For OTP step, we just validate and move to next step
    // The actual verification happens when user submits the new password
    setCurrentStep("newPassword");
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateNewPassword()) return;
    
    const result = await resetPassword(formData.email, formData.otp, formData.newPassword);
    
    if (result.success) {
      toast.success("Password reset successful! Please login with your new password.");
      navigate("/auth/login");
    } else {
      toast.error(result.error || "Password reset failed");
      setErrors({ newPassword: result.error || "Password reset failed" });
    }
  };

  const renderEmailStep = () => (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-gradient-to-br from-primary via-primary-dark to-green-700 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-green-600/20"></div>
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-20 translate-x-20"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 -translate-x-16"></div>
        
        <div className="relative z-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
              <KeyRound className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Reset your password</h2>
            <p className="text-white/80">
              Enter your email address and we'll send you a verification code
            </p>
          </div>

          <form onSubmit={handleEmailSubmit} className="space-y-6">
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

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-white text-primary hover:bg-primary hover:text-white font-semibold rounded-2xl transition-all duration-300 group shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border-0"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2"></div>
                  Sending...
                </div>
              ) : (
                "Send Verification Code"
              )}
            </Button>

            <div className="text-center pt-4 border-t border-white/20">
              <Link 
                to="/auth/login" 
                className="text-sm text-white/80 hover:text-white transition-colors"
              >
                ← Back to login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  const renderOtpStep = () => (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-gradient-to-br from-primary via-primary-dark to-green-700 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-green-600/20"></div>
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-20 translate-x-20"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 -translate-x-16"></div>
        
        <div className="relative z-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Enter verification code</h2>
            <p className="text-white/80">
              We've sent a 6-digit code to
            </p>
            <p className="font-semibold text-white mt-1">{formData.email}</p>
          </div>

        <form onSubmit={handleOtpSubmit} className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={formData.otp}
                onChange={handleOtpChange}
                className="gap-2"
              >
                <InputOTPGroup>
                  <InputOTPSlot 
                    index={0} 
                    className="w-12 h-12 text-lg font-semibold border-2 rounded-xl transition-all duration-200 focus:border-primary"
                  />
                  <InputOTPSlot 
                    index={1} 
                    className="w-12 h-12 text-lg font-semibold border-2 rounded-xl transition-all duration-200 focus:border-primary"
                  />
                  <InputOTPSlot 
                    index={2} 
                    className="w-12 h-12 text-lg font-semibold border-2 rounded-xl transition-all duration-200 focus:border-primary"
                  />
                  <InputOTPSlot 
                    index={3} 
                    className="w-12 h-12 text-lg font-semibold border-2 rounded-xl transition-all duration-200 focus:border-primary"
                  />
                  <InputOTPSlot 
                    index={4} 
                    className="w-12 h-12 text-lg font-semibold border-2 rounded-xl transition-all duration-200 focus:border-primary"
                  />
                  <InputOTPSlot 
                    index={5} 
                    className="w-12 h-12 text-lg font-semibold border-2 rounded-xl transition-all duration-200 focus:border-primary"
                  />
                </InputOTPGroup>
              </InputOTP>
            </div>
            
            {errors.otp && (
              <p className="text-red-300 text-sm text-center mt-2">{errors.otp}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading || formData.otp.length !== 6}
            className="w-full h-12 bg-white text-primary hover:bg-primary hover:text-white font-semibold rounded-2xl transition-all duration-300 group disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border-0"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2"></div>
                Verifying...
              </div>
            ) : (
              "Verify Code"
            )}
          </Button>
        </form>
        </div>
      </div>
    </div>
  );

  const renderNewPasswordStep = () => (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-gradient-to-br from-primary via-primary-dark to-green-700 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-green-600/20"></div>
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-20 translate-x-20"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 -translate-x-16"></div>
        
        <div className="relative z-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Create new password</h2>
            <p className="text-white/80">
              Enter your new password below
            </p>
          </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* New Password Field */}
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-sm font-medium text-white/90">
                New Password
              </Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  name="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className={`pr-12 h-12 border-0 rounded-2xl transition-all duration-300 bg-black/40 backdrop-blur-sm text-white placeholder:text-white/60 focus:bg-black/60 focus:ring-2 focus:ring-white/20 ${
                    errors.newPassword 
                      ? "ring-2 ring-red-400" 
                      : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/80 transition-colors"
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-red-300 text-sm mt-1">{errors.newPassword}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-white/90">
                Confirm New Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`pr-12 h-12 border-0 rounded-2xl transition-all duration-300 bg-black/40 backdrop-blur-sm text-white placeholder:text-white/60 focus:bg-black/60 focus:ring-2 focus:ring-white/20 ${
                    errors.confirmPassword 
                      ? "ring-2 ring-red-400" 
                      : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/80 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-300 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-white text-primary hover:bg-primary hover:text-white font-semibold rounded-2xl transition-all duration-300 group shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border-0"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2"></div>
                Updating password...
              </div>
            ) : (
              "Update Password"
            )}
          </Button>
        </form>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {currentStep === "email" && renderEmailStep()}
      {currentStep === "otp" && renderOtpStep()}
      {currentStep === "newPassword" && renderNewPasswordStep()}
    </>
  );
};
