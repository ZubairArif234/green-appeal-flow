import { Button } from "@/components/ui/button";
import { Check, CheckCircle, CircleCheckBig, Star } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { useEffect, useState } from "react";
import { apiService } from "@/services/api";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";

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

export const PricingSection2 = () => {

  const [isLoading , setIsLoading] = useState(false)
  const [isSubmitted , setIsSubmitted] = useState(false)
      const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
    } = useForm({
      defaultValues: {
        fullName: "",
        email: "",
        company: "",
        employees: "",
        role: "",
      },
    });
  
     const onSubmit = async (data:any) => {
      try{
  setIsLoading(true)
        console.log("✅ Form Values:", data);
        const response = await apiService.schedule(data);
        if(response){
          setIsLoading(false)
          setIsSubmitted(true)
        }
      }catch(err){
        console.log(err , "error");
        setIsLoading(false)
        
      }finally{
        setIsLoading(false)
  
      }
            
      // You can now send this data to your backend or API
    };

   const [plans, setPlans] = useState<any>([]);
    // const [isLoading, setIsLoading] = useState(true);
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
          const productsMap = new Map<string, any[]>();
          activePrices.forEach((price: any) => {
            const plan: any = {
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
          const allPlans: any[] = [];
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
  
    
  const getPlanFeatures = (planName: string) => {
    const name = planName.toLowerCase();
    if (name.includes("starter")) {
      return ["30 analyses per month", "Standard support"];
    }
    if (name.includes("pro")) {
      return ["80 analyses per month", "Dedicated support","Analysis Export and Share"];
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
  // const plans = [
  //   {
  //     name: "Free Trial",
  //     price: "$0",
  //     period: "for 14 days",
  //     description: "Perfect for testing our AI capabilities",
  //     features: [
  //       "5 denial analyses",
  //       "Basic appeal guidance", 
  //       "Email support",
  //       "HIPAA-conscious workflow"
  //     ],
  //     cta: "Start Free Trial",
  //     popular: false
  //   },
  //   {
  //     name: "Pro",
  //     price: "$99",
  //     period: "per month",
  //     description: "Best for small to medium practices",
  //     features: [
  //       "Unlimited denial analyses",
  //       "Advanced AI guidance",
  //       "Priority support",
  //       "Staff training materials",
  //       "Performance analytics",
  //       "CMS guideline updates"
  //     ],
  //     cta: "Choose Pro",
  //     popular: true
  //   },
  //   {
  //     name: "Enterprise",
  //     price: "Custom",
  //     period: "pricing",
  //     description: "For large healthcare organizations",
  //     features: [
  //       "Everything in Pro",
  //       "Dedicated account manager",
  //       "Custom integrations",
  //       "Advanced reporting",
  //       "Team training sessions",
  //       "SLA guarantees"
  //     ],
  //     cta: "Contact Sales",
  //     popular: false
  //   }
  // ];

  return (
     <section id="pricing" className="py-20 bg-gradient-light-green">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
              <span className="text-primary">Choose</span> Your Plan
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">Price that pays for itself after just one recovered denial</p>
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

 <div className="grid gap-8 lg:grid-cols-4 max-w-7xl mx-auto">
{/* free plan */}

 <Card
                className={`border-2  bg-white flex flex-col h-full ${
                  false ? "border-primary relative" : "border-muted"
                }`}
              >
                {/* {plan.popular && (
                   <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">
                  <Star className="h-3 w-3 mr-1" />
                  Most Popular
                </Badge>
              </div>
                )} */}
                <CardHeader className="text-center pt-8">
                  {/* <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10">
                    {getPlanIcon(plan.name)}
                  </div> */}
                  <CardTitle className="text-2xl font-bold">Free Trial</CardTitle>
                  {/* <CardDescription>free palns</CardDescription> */}
                

                  <div className="mt-4">
                    <span className="text-4xl font-bold ">
                      $0
                    </span>
                    <span className="text-muted-foreground">
                      / {billingInterval}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="h-[80%] ">
                  <div className="flex flex-col justify-between items-stretch !h-full">
                    <ul className="space-y-2 mb-6 h-full">
                      {["3 Free Analyses"].map((feature, idx) => (
                        <li key={idx} className="flex items-center space-x-2">
                           <CheckCircle className="h-4 w-4 text-primary" />
                          <span className="w-[90%]">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div>
                      
                      <p className="text-slate-400 text-center text-sm mb-2">No credit card needed</p>
                       
                    
                         <Link to="/auth/signup">

                        <Button
                          className={`w-full ${
                            "bg-primary/10 text-primary hover:bg-primary hover:text-white"
                            }`}
                            >
                          Select Plan
                        </Button>
                          </Link>
                      
                    </div>
                  </div>
                </CardContent>
              </Card>

            {orderedPlans.map((plan) => (
              <Card
                key={plan.priceId}
                className={`border-2  bg-white flex flex-col h-full ${
                  plan.popular ? "border-primary relative" : "border-muted"
                }`}
              >
                {plan.popular && (
                   <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">
                  <Star className="h-3 w-3 mr-1" />
                  Most Popular
                </Badge>
              </div>
                )}
                <CardHeader className="text-center pt-8">
                  {/* <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10">
                    {getPlanIcon(plan.name)}
                  </div> */}
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  {plan.name === "Enterprise" ?(
                    <div className="mt-4">
                        <span className="text-4xl font-bold ">
                     Custom
                    </span>
                      </div>
                  ) :
                  (

                  <div className="mt-4">
                    <span className="text-4xl font-bold ">
                      ${plan.price}
                    </span>
                    <span className="text-muted-foreground">
                      /{plan.interval}
                    </span>
                  </div>
                  )}
                  <p className="text-primary">{plan.interval == "year" ? plan.name == "Starter" ? "(Save $29)" :plan.name == "Pro" ? "(Save $89)" : null :null}</p>
                </CardHeader>

                <CardContent className="h-[80%] ">
                  <div className="flex flex-col justify-between items-stretch !h-full">
                    <ul className="space-y-2 mb-6 h-full">
                      {getPlanFeatures(plan.name).map((feature, idx) => (
                        <li key={idx} className="flex items-center space-x-2">
                           <CheckCircle className="h-4 w-4 text-primary" />
                          <span className="w-[90%]">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div>
                       {plan.name !== "Enterprise" && (

                      <p className="text-slate-400 text-center text-sm mb-2">Cancel Anytime</p>
                       )} 
                      {plan.name === "Enterprise" ? (
                       
                        // <Button
                        
                        //   className={`w-full ${
                        //     plan.popular
                        //     ? "bg-primary text-white"
                        //     : "bg-primary/10 text-primary hover:bg-primary hover:text-white"
                        //     }`}
                        //     >
                        //   Contact Sales
                        // </Button>

                          <Dialog onOpenChange={(open) => {
    if (!open) {setIsSubmitted(false); reset()};
  }}>
      {/* Trigger — button to open dialog */}
      <DialogTrigger asChild>
         <Button
                        
                          className={`w-full ${
                            plan.popular
                            ? "bg-primary text-white"
                            : "bg-primary/10 text-primary hover:bg-primary hover:text-white"
                            }`}
                            >
                          Contact Sales
                        </Button>
                  {/* <Button size="lg" variant="outline" className="w-full bg-transparent">
                    Schedule a Demo
                  </Button> */}
        {/* <Button>Open Dialog</Button> */}
      </DialogTrigger>

      {/* Content — what appears inside the modal */}
      <DialogContent className="max-h-[95%] overflow-auto">
        <DialogHeader>
          <DialogTitle>Talk to Our Team</DialogTitle>
          <DialogDescription>
            Get a personalized demo and discuss your specific needs.
          </DialogDescription>
        </DialogHeader>
{!isSubmitted ? (

         <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 ">
      {/* Full Name */}
      <label>
        <p>Full name:</p>
        <Input
          type="text"
          placeholder="Jane Doe"
          className="w-full ring-offset-0 !outline-none px-3 py-2 rounded-xl border border-gray-200 focus:border-primary focus:ring-primary/20"
          {...register("fullName", { required: "Full name is required" })}
        />
        {errors.fullName && (
          <span className="text-red-500 text-sm">{errors.fullName.message}</span>
        )}
      </label>

      {/* Work Email */}
      <label>
        <p>Work email:</p>
        <Input
          type="email"
          placeholder="jane@midtownhealth.com"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email address",
            },
          })}
          className="w-full ring-offset-0 !outline-none px-3 py-2 rounded-xl border border-gray-200 focus:border-primary focus:ring-primary/20"
        />
        {errors.email && (
          <span className="text-red-500 text-sm">{errors.email.message}</span>
        )}
      </label>

      {/* Company Name */}
      <label>
        <p>Company or Practice Name:</p>
        <Input
          type="text"
          placeholder="Midtown Family Health"
          {...register("company", { required: "Company name is required" })}
          className="w-full ring-offset-0 !outline-none px-3 py-2 rounded-xl border border-gray-200 focus:border-primary focus:ring-primary/20"
        />
        {errors.company && (
          <span className="text-red-500 text-sm">{errors.company.message}</span>
        )}
      </label>

      {/* Employees */}
      <label>
        <p>Number of Full-Time Employees:</p>
        <select
          {...register("employees", { required: "Please select a range" })}
          className="w-full ring-offset-0 !outline-none px-3 py-2 rounded-xl border border-gray-200 focus:border-primary focus:ring-primary/20"
        >
          <option value="">Select</option>
          <option>0 - 10</option>
          <option>11 - 50</option>
          <option>51 - 100</option>
          <option>101 - 200</option>
          <option>201+</option>
        </select>
        {errors.employees && (
          <span className="text-red-500 text-sm">{errors.employees.message}</span>
        )}
      </label>

      {/* Role */}
      <label>
        <p>Your Role:</p>
        <Input
          type="text"
          placeholder="Billing Manager, Practice Owner, Rev Cycle Lead"
          {...register("role", { required: "Role is required" })}
          className="w-full ring-offset-0 !outline-none px-3 py-2 rounded-xl border border-gray-200 focus:border-primary focus:ring-primary/20"
        />
        {errors.role && (
          <span className="text-red-500 text-sm">{errors.role.message}</span>
        )}
      </label>

      {/* Buttons */}
      <div className="flex justify-end gap-4">
        {/* <Button
          type="button"
          variant="outline"
          onClick={() => reset()}
        >
          Cancel
        </Button> */}
        <Button
        disabled={isLoading}
          type="submit"
          className="!bg-primary-700 !text-white"
        >
          {isLoading ? "Submitting..." : "Submit"}
          
        </Button>
      </div>
    </form>
):
(
  <div className="flex flex-col items-center gap-2 py-20">
    <CircleCheckBig  size={120} className="text-primary"/>
    <p className="text-primary text-2xl font-semibold">Request Submitted!</p>
    <p className="text-center text-slate-500 text-sm">Thank you for your submission. A member of our team will reach out soon!.</p>
    </div>
) }


       
      </DialogContent>
    </Dialog>
                      ) : (
                        <Link to={`/auth/signup?plan=${plan.priceId}`}   >
                        <Button
                        variant="outline"
                        // onClick={() => handleSelectPlan(plan.priceId)}
                        disabled={processingPlan === plan.priceId}
                        className={`w-full ${
                          plan.popular
                          ? "bg-primary text-white"
                          : "bg-transparent text-slate-600 hover:bg-primary hover:text-white"
                          }`}
                          >
                         Select Plan
                        </Button>
                          </Link>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>


        
        </div>
      </section>
  );
};
