import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { XCircle, ArrowLeft, CreditCard, Home } from 'lucide-react';

const PaymentCancel = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-primary/5 flex items-center justify-center">
      <div className="max-w-md mx-auto p-6">
        <Card className="text-center shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Payment Cancelled
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-gray-600">
              <p className="text-lg mb-2">
                No worries, {user?.name}!
              </p>
              <p className="text-sm">
                Your payment has been cancelled and no charges were made to your account.
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
              <div className="flex items-center justify-center space-x-2 text-blue-800">
                <CreditCard className="w-5 h-5" />
                <span className="font-semibold">No Charges Applied</span>
              </div>
              <p className="text-sm text-blue-700 mt-1">
                You can try again anytime or continue with your current plan.
              </p>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={() => navigate('/plans')}
                className="w-full bg-primary hover:bg-primary-dark text-white"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              
              <Button 
                onClick={() => navigate('/dashboard')}
                variant="outline"
                className="w-full border-primary text-primary hover:bg-primary hover:text-white"
              >
                <Home className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>

            <div className="text-xs text-gray-500 pt-4 border-t">
              <p>
                Need help choosing a plan? Contact our support team for personalized recommendations.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentCancel;


