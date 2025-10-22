import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ArrowRight, Home, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifyPayment = async () => {
      if (sessionId) {
        console.log('✅ Payment session ID:', sessionId);
        try {
          // Refresh user data to get updated subscription status
          await refreshUser();
          toast.success('Payment verified! Your subscription is now active.');
        } catch (error) {
          console.error('❌ Error refreshing user data:', error);
          toast.error('Payment successful, but there was an issue updating your account. Please contact support.');
        }
      }
      setIsVerifying(false);
    };

    verifyPayment();
  }, [sessionId]);

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-primary/5 flex items-center justify-center">
        <div className="max-w-md mx-auto p-6">
          <Card className="text-center shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
            <CardContent className="pt-8">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Verifying Payment...
              </h2>
              <p className="text-gray-600">
                Please wait while we confirm your subscription.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-primary/5 flex items-center justify-center">
      <div className="max-w-md mx-auto p-6">
        <Card className="text-center shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Payment Successful!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-gray-600">
              <p className="text-lg mb-2">
                Thank you for your purchase, {user?.name}!
              </p>
              <p className="text-sm">
                Your subscription has been activated.
              </p>
            </div>

            <div className="bg-green-50 p-4 rounded-xl border border-green-200">
              <div className="flex items-center justify-center space-x-2 text-green-800">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Subscription Active</span>
              </div>
              {/* <p className="text-sm text-green-700 mt-1">
                You can now create unlimited cases and access advanced AI analysis.
              </p> */}
            </div>

            <div className="space-y-3">
              <Button 
                onClick={() => navigate('/dashboard')}
                className="w-full bg-primary hover:bg-primary-dark text-white"
              >
                <Home className="w-4 h-4 mr-2" />
                Go to Dashboard
              </Button>
              
              <Button 
                onClick={() => navigate('/appeal')}
                variant="outline"
                className="w-full border-primary text-primary hover:bg-primary hover:text-white"
              >
                Start New Analysis
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {/* <div className="text-xs text-gray-500 pt-4 border-t">
              <p>
                You'll receive a confirmation email shortly. If you have any questions, 
                please contact our support team.
              </p>
            </div> */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentSuccess;
