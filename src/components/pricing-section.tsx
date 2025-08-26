import { Button } from "@/components/ui/button";
import { Check, Star } from "lucide-react";

export const PricingSection = () => {
  const plans = [
    {
      name: "Free Trial",
      price: "$0",
      period: "for 14 days",
      description: "Perfect for testing our AI capabilities",
      features: [
        "5 denial analyses",
        "Basic appeal guidance", 
        "Email support",
        "HIPAA-conscious workflow"
      ],
      cta: "Start Free Trial",
      popular: false
    },
    {
      name: "Pro",
      price: "$99",
      period: "per month",
      description: "Best for small to medium practices",
      features: [
        "Unlimited denial analyses",
        "Advanced AI guidance",
        "Priority support",
        "Staff training materials",
        "Performance analytics",
        "CMS guideline updates"
      ],
      cta: "Choose Pro",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "pricing",
      description: "For large healthcare organizations",
      features: [
        "Everything in Pro",
        "Dedicated account manager",
        "Custom integrations",
        "Advanced reporting",
        "Team training sessions",
        "SLA guarantees"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-6">
        <div className="text-center space-y-6 mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
            Simple, Transparent
            <span className="text-primary block">Pricing</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your practice size and needs. No hidden fees, cancel anytime.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`relative p-8 rounded-3xl border bg-card hover:shadow-elegant transition-smooth hover:-translate-y-2 ${
                plan.popular 
                  ? 'border-primary shadow-card ring-2 ring-primary/10' 
                  : 'border-border'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Most Popular
                  </div>
                </div>
              )}
              
              <div className="text-center space-y-4 mb-8">
                <h3 className="text-2xl font-bold text-foreground">{plan.name}</h3>
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-foreground">
                    {plan.price}
                    {plan.price !== "Custom" && (
                      <span className="text-lg text-muted-foreground font-normal">/{plan.period}</span>
                    )}
                  </div>
                  {plan.price === "Custom" && (
                    <div className="text-lg text-muted-foreground">{plan.period}</div>
                  )}
                </div>
                <p className="text-muted-foreground">{plan.description}</p>
              </div>
              
              <div className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
              
              <Button 
                className={`w-full ${
                  plan.popular
                    ? 'bg-gradient-primary hover:opacity-90 shadow-button'
                    : 'border-primary text-primary hover:bg-primary/5'
                } transition-smooth`}
                variant={plan.popular ? "default" : "outline"}
                size="lg"
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
