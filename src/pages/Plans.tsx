import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { apiService } from "@/services/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Crown,
  Check,
  ArrowLeft,
  Loader2,
  Zap,
  Shield,
  Users,
} from "lucide-react";

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
  const [billingInterval, setBillingInterval] = useState<"month" | "year">(
    "month"
  );

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await apiService.getAllPlans();
      if (response.success && response.data) {
        const activePrices = response.data.prices.data.filter(
          (price: any) =>
            price.active && price.product && typeof price.product === "object"
        );

        // Group by product (Starter, Pro, Enterprise)
        const productsMap = new Map<string, Plan[]>();
        activePrices.forEach((price: any) => {
          const plan: Plan = {
            id: price.product.id,
            name: price.product.name || "Plan",
            description: price.product.description || "",
            price: price.unit_amount / 100,
            currency: price.currency.toUpperCase(),
            interval: price.recurring?.interval || "month",
            metadata: price.product.metadata || {},
            popular: price.product.name?.toLowerCase().includes("pro"),
            priceId: price.id,
          };

          if (!productsMap.has(price.product.id)) {
            productsMap.set(price.product.id, []);
          }
          productsMap.get(price.product.id)?.push(plan);
        });

        // Build plans correctly
        const allPlans: Plan[] = [];
        productsMap.forEach((prices, productId) => {
          const productName = prices[0].name.toLowerCase();
          allPlans.push(...prices);

          // if (productName.includes("enterprise")) {
          //   // Always include Enterprise (regardless of interval)
          // } else {
          //   // Only keep plan that matches current billingInterval
          //   const match = prices.find((p) => p.interval === billingInterval);
          //   if (match) allPlans.push(match);
          // }
        });

        setPlans(allPlans);
      } else {
        toast.error(
          "Failed to load plans: " + (response.error || "Unknown error")
        );
      }
    } catch (error) {
      toast.error("Failed to load plans");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPlan = async (priceId: string) => {
    if (!user) return;
    setProcessingPlan(priceId);
    try {
      const response = await apiService.createPaymentSession({
        productId: priceId, // Backend expects 'productId' but we're sending priceId
      });
      if (response.success && response.data?.url) {
        window.location.href = response.data.url;
      } else {
        toast.error("Failed to create payment session");
      }
    } catch (error) {
      toast.error("Payment processing failed");
      console.error(error);
    } finally {
      setProcessingPlan(null);
    }
  };

  const getPlanIcon = (planName: string) => {
    const name = planName.toLowerCase();
    if (name.includes("starter")) return <Users className="w-6 h-6" />;
    if (name.includes("pro")) return <Crown className="w-6 h-6" />;
    if (name.includes("enterprise")) return <Shield className="w-6 h-6" />;
    return <Zap className="w-6 h-6" />;
  };

  const getPlanFeatures = (planName: string) => {
    const name = planName.toLowerCase();
    if (name.includes("starter")) {
      return ["30 analyses per month", "Standard support"];
    }
    if (name.includes("pro")) {
      return ["80 analyses per month", "Dedicated support"];
    }
    if (name.includes("enterprise")) {
      return [
        "Custom pricing tailored to your team's needs",
        "Team workspace & dashboard",
        "Unlimited Denial Analysis submissions",
        "Initial onboarding and team training",
        "Dedicated support",
        "BAA available",
      ];
    }
    return ["AI-Powered Analysis", "Professional Reports", "Customer Support"];
  };

  // Enterprise always included
  const orderedPlans = plans
    .filter((p) => {
      if (p.name.toLowerCase().includes("enterprise")) return true;
      return p.interval === billingInterval;
    })
    .sort((a, b) => {
      const order = ["starter", "pro", "enterprise"];
      return (
        order.indexOf(a.name.toLowerCase()) -
        order.indexOf(b.name.toLowerCase())
      );
    });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
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
                onClick={() => navigate("/dashboard")}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-xl font-bold hidden md:block">Choose Your Plan</h1>
            </div>
            <div className="text-sm text-muted-foreground hidden md:block">
              Welcome, {user?.name}
            </div>
          </div>
        </div>
      </div>

      {/* Plans Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Upgrade Your Experience</h2>
          <div className="flex justify-center gap-4 mt-4">
            <Button
              variant={billingInterval === "month" ? "default" : "outline"}
              onClick={() => setBillingInterval("month")}
            >
              Monthly
            </Button>
            <Button
              variant={billingInterval === "year" ? "default" : "outline"}
              onClick={() => setBillingInterval("year")}
            >
              Yearly
            </Button>
          </div>
        </div>

        {orderedPlans.length === 0 ? (
          <p className="text-center">No plans available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {orderedPlans.map((plan) => (
              <Card
                key={plan.priceId}
              className={`border-2  bg-white flex flex-col h-full ${
                  plan.popular ? "border-primary relative" : "border-muted"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-white">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center pt-8">
                  <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10">
                    {getPlanIcon(plan.name)}
                  </div>
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  {plan.name === "Enterprise" ?(
                    <div className="mt-4">
                        <span className="text-4xl font-bold text-primary">
                     Custom
                    </span>
                      </div>
                  ) :(

                  <div className="mt-4">
                    <span className="text-4xl font-bold text-primary">
                      ${plan.price}
                    </span>
                    <span className="text-muted-foreground">
                      /{plan.interval}
                    </span>
                  </div>
                  )}
                </CardHeader>

                <CardContent className="h-[80%]">
                  <div className="flex flex-col justify-between items-stretch !h-full">
                    <ul className="space-y-2 mb-6 h-full">
                      {getPlanFeatures(plan.name).map((feature, idx) => (
                        <li key={idx} className="flex items-center space-x-2">
                          <Check className="w-4 h-4 text-primary" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div>
                      {plan.name === "Enterprise" ? (
                        <Button
                          className={`w-full ${
                            plan.popular
                              ? "bg-primary text-white"
                              : "bg-primary/10 text-primary hover:bg-primary hover:text-white"
                          }`}
                        >
                          Contact
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleSelectPlan(plan.priceId)}
                          disabled={processingPlan === plan.priceId || (user?.subscriptionId && user?.planType === plan?.name)}
                          className={`w-full ${
                            plan.popular
                              ? "bg-primary text-white"
                              : "bg-primary/10 text-primary hover:bg-primary hover:text-white"
                          }`}
                        >
                          {processingPlan === plan.priceId ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Processing...
                            </>
                          ) : user?.subscriptionId && user?.planType === plan?.name ?("Subscribed"): (
                            "Select Plan"
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Plans;