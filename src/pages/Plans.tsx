import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { apiService, PlansListResponse } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Crown, 
  Check, 
  ArrowLeft,
  Loader2,
  Zap,
  Shield,
  Users
} from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: string;
  metadata: any;
  popular?: boolean;
  priceId: string;
}

const Plans = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      console.log('Fetching plans...');
      const response = await apiService.getAllPlans();
      console.log('Plans response:', response);
      
      if (response.success && response.data) {
        // Filter active prices and remove duplicates by product ID
        const activePrices = response.data.prices.data
          .filter((price: any) => 
            price.active && 
            price.product && 
            typeof price.product === 'object'
          );

        console.log('Active prices:', activePrices);

        // Remove duplicates by product ID - keep only the first price per product
        const uniqueProducts = new Map();
        activePrices.forEach((price: any) => {
          if (!uniqueProducts.has(price.product.id)) {
            uniqueProducts.set(price.product.id, price);
          }
        });

        // Transform to our format
        const transformedPlans = Array.from(uniqueProducts.values()).map((price: any) => ({
          id: price.product.id,
          name: price.product.name || 'Plan',
          description: price.product.description || '',
          price: price.unit_amount / 100,
          currency: price.currency.toUpperCase(),
          interval: price.recurring?.interval || 'month',
          metadata: price.product.metadata || {},
          popular: price.product.name?.toLowerCase().includes('pro'),
          priceId: price.id, // Store the price ID for payment
        }));
        
        console.log('Transformed unique plans:', transformedPlans);
        setPlans(transformedPlans);
      } else {
        console.error('Failed to fetch plans:', response.error);
        toast.error('Failed to load plans: ' + (response.error || 'Unknown error'));
      }
    } catch (error) {
      toast.error('Failed to load plans');
      console.error('Plans fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPlan = async (planId: string) => {
    if (!user) return;
    
    setProcessingPlan(planId);
    try {
      console.log('Creating payment session for product:', planId);
      const response = await apiService.createPaymentSession({ productId: planId });
      console.log('Payment session response:', response);
      
      if (response.success && response.data?.url) {
        console.log('Redirecting to Stripe checkout:', response.data.url);
        // Redirect to Stripe checkout
        window.location.href = response.data.url;
      } else {
        console.error('Payment session failed:', response.error);
        toast.error('Failed to create payment session: ' + (response.error || 'Unknown error'));
      }
    } catch (error) {
      toast.error('Payment processing failed');
      console.error('Payment error:', error);
    } finally {
      setProcessingPlan(null);
    }
  };

  const getPlanIcon = (planName: string) => {
    const name = planName.toLowerCase();
    if (name.includes('basic') || name.includes('starter')) return <Users className="w-6 h-6" />;
    if (name.includes('pro') || name.includes('premium')) return <Crown className="w-6 h-6" />;
    if (name.includes('enterprise') || name.includes('business')) return <Shield className="w-6 h-6" />;
    return <Zap className="w-6 h-6" />;
  };

  const getPlanFeatures = (planName: string) => {
    const name = planName.toLowerCase();
    if (name.includes('basic') || name.includes('starter')) {
      return [
        '5 Cases per month',
        'Basic AI Analysis',
        'Email Support',
        'Standard Processing'
      ];
    }
    if (name.includes('pro') || name.includes('premium')) {
      return [
        'Unlimited Cases',
        'Advanced AI Analysis',
        'Priority Support',
        'Fast Processing',
        'Export Reports',
        'Analytics Dashboard'
      ];
    }
    if (name.includes('enterprise') || name.includes('business')) {
      return [
        'Unlimited Cases',
        'Premium AI Analysis',
        'Dedicated Support',
        'Instant Processing',
        'Advanced Reports',
        'Team Management',
        'API Access',
        'Custom Integration'
      ];
    }
    return [
      'AI-Powered Analysis',
      'Professional Reports',
      'Customer Support'
    ];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/8 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/8">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="text-primary hover:text-primary-dark hover:bg-primary/5 transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="h-6 border-l border-primary/20" />
              <h1 className="text-xl font-bold text-foreground">Choose Your Plan</h1>
            </div>
            <div className="text-sm text-muted-foreground">
              Welcome, {user?.name}
            </div>
          </div>
        </div>
      </div>

      {/* Plans Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">
            Upgrade Your Experience
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {user?.isFreeTrialUser 
              ? 'Your free trial has ended. Choose a plan to continue using our AI-powered denial analysis.'
              : 'Select the perfect plan for your needs and unlock advanced features.'
            }
          </p>
          {user?.noOfCasesLeft !== undefined && (
            <div className="mt-4">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                {user.noOfCasesLeft} cases remaining
              </Badge>
            </div>
          )}
        </div>

        {plans.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No plans available at the moment.</p>
            <Button 
              onClick={() => navigate('/dashboard')} 
              className="mt-4"
            >
              Return to Dashboard
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`relative border-2 transition-all duration-300 hover:shadow-xl ${
                  plan.popular 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-white px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pt-8">
                  <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10">
                    {getPlanIcon(plan.name)}
                  </div>
                  <CardTitle className="text-2xl font-bold text-foreground">
                    {plan.name}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {plan.description}
                  </CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-primary">
                      ${plan.price}
                    </span>
                    {/* <span className="text-muted-foreground">
                      /{plan.interval}
                    </span> */}
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <ul className="space-y-3 mb-8">
                    {getPlanFeatures(plan.name).map((feature, index) => (
                      <li key={`${plan.id}-feature-${index}`} className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handleSelectPlan(plan.id)}
                    disabled={processingPlan === plan.id}
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-primary hover:bg-primary-dark text-white' 
                        : 'bg-primary/10 hover:bg-primary hover:text-white text-primary'
                    }`}
                  >
                    {processingPlan === plan.id ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Select Plan'
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Money Back Guarantee */}
        <div className="text-center mt-12 p-6 bg-white/50 rounded-xl border border-primary/10">
          <Shield className="w-8 h-8 mx-auto mb-3 text-primary" />
          <h3 className="font-semibold text-foreground mb-2">30-Day Money Back Guarantee</h3>
          <p className="text-sm text-muted-foreground">
            Not satisfied? Get a full refund within 30 days, no questions asked.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Plans;
