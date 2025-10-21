import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Mail, ArrowRight, RefreshCw } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export const VerifyEmailForm = () => {
  const [otp, setOtp] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const { verifyEmail,resendToken,login, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get email from navigation state or redirect to signup
  const email = location.state?.email || "";
  const fromSignup = location.state?.fromSignup || false;
  
  useEffect(() => {
    if (!email) {
      toast.error("No email provided. Please sign up first.");
      navigate("/auth/signup");
    }
  }, [email, navigate]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleOtpChange = (value: string) => {
    setOtp(value);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }
    
    setError("");
    
    const result = await verifyEmail(email, otp);
    
    if (result.success) {
      setSuccess("Email verified successfully! Redirecting...");
      toast.success("Email verified successfully!");
      const loginResult = await login(location.state.userData);

        if (loginResult.success) {
      
      // Determine redirect based on user role from the login result
     
      if (loginResult.user?.role === 'admin') {
      navigate("/admin")
      }else{
       navigate(`/dashboard?plan=${location.state.priceId}`)

      }
    }
      // setTimeout(() => {
      //   navigate("/auth/login");
      // }, 1500);
    } else {
      setError(result.error || "Verification failed");
      toast.error(result.error || "Verification failed");
    }
  };

  const handleResendOtp = async () => {
    if (!email) return;
    
    setError("");
    
    // For resending OTP, we need to trigger the registration process again
    // This will generate a new OTP and send it to the email
    const userData = location.state?.userData;
    if (userData) {
      const result = await resendToken(userData);
      if (result.success) {
        setResendTimer(60); // Start 60 second cooldown
        setSuccess("Verification code sent successfully!");
        toast.success("New verification code sent!");
      } else {
        setError("Failed to resend code");
        toast.error("Failed to resend code");
      }
    } else {
      setError("Unable to resend code. Please try signing up again.");
      toast.error("Unable to resend code. Please try signing up again.");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Modern gradient card */}
      <div className="bg-gradient-to-br from-primary via-primary-dark to-green-700 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-green-600/20"></div>
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-20 translate-x-20"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 -translate-x-16"></div>
        
        <div className="relative z-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Check your email</h2>
            <p className="text-white/80">
              We've sent a 6-digit verification code to
            </p>
            <p className="font-semibold text-white mt-1">{email}</p>
          </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* OTP Input */}
          <div className="space-y-2">
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
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
            
            {error && (
              <p className="text-red-300 text-sm text-center mt-2">{error}</p>
            )}
            
            {success && (
              <p className="text-green-300 text-sm text-center mt-2">{success}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading || otp.length !== 6}
            className="w-full h-12 bg-white text-primary hover:bg-primary hover:text-white font-semibold rounded-2xl transition-all duration-300 group disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border-0"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2"></div>
                Verifying...
              </div>
            ) : (
              "Verify Email"
            )}
          </Button>

          {/* Resend Code */}
          <div className="text-center pt-4 border-t border-white/20">
            <p className="text-white/80 mb-3">Didn't receive the code?</p>
            <Button
              type="button"
              variant="outline"
              onClick={handleResendOtp}
              disabled={isLoading || resendTimer > 0}
              className="border-2 border-white/30 bg-white/10 text-white hover:bg-white/20 hover:border-white/50 transition-all duration-300"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                  Sending...
                </div>
              ) : resendTimer > 0 ? (
                `Resend in ${resendTimer}s`
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Resend Code
                </>
              )}
            </Button>
          </div>

          {/* Back to Login */}
          <div className="text-center pt-4">
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
};
