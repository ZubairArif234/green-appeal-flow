import { Button } from "@/components/ui/button";
import { ArrowRight, BadgeCheck, CheckCircle, CircleCheckBig, Users, Zap } from "lucide-react";
import { Card } from "./ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import { apiService } from "@/services/api";
import { useState } from "react";

export const CTASection = () => {



  return (
    <section className="py-20 bg-gradient-to-br from-primary via-primary to-primary-dark relative overflow-hidden">
      {/* Premium Grid Pattern Background */}
      <div className="absolute inset-0 grid-pattern opacity-40"></div>
      
      {/* Premium Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-light/30 to-primary-dark/30"></div>
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/8 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white/8 blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-white/3 blur-3xl"></div>
      
      {/* Additional premium grid overlay for depth */}
      <div className="absolute inset-0 grid-pattern-subtle opacity-25"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <h2 className="text-4xl lg:text-6xl font-bold text-white leading-tight drop-shadow-sm">
            Ready to Transform Your
            <span className="block">Denial Process?</span>
          </h2>
          
          <p className="text-xl text-white/95 max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
            Join hundreds of healthcare providers who have already started turning their denials into approvals. 
            Get started today with our free trial—no credit card required.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-gray-50 shadow-2xl transition-all duration-300 text-lg px-8 py-6 font-semibold rounded-xl border-2 border-white/20"
            >
              Create Free Account
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-2 border-white bg-white/15 backdrop-blur-md text-white hover:bg-white/25 hover:border-white transition-all duration-300 text-lg px-8 py-6 font-semibold shadow-2xl rounded-xl"
            >
              Schedule Demo
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
            <div className="flex items-center gap-2 text-white/95">
              <CheckCircle className="w-5 h-5 text-white" />
              <span className="text-sm font-medium">14-day free trial</span>
            </div>
            <div className="flex items-center gap-2 text-white/95">
              <CheckCircle className="w-5 h-5 text-white" />
              <span className="text-sm font-medium">No credit card required</span>
            </div>
            <div className="flex items-center gap-2 text-white/95">
              <CheckCircle className="w-5 h-5 text-white" />
              <span className="text-sm font-medium">Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const CTASection2 = () => {
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

  return (
   <section className="py-24 bg-white">
        <div className="p-8 border-2 border-muted hover:border-primary/20 transition-colors bg-white">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance mb-6">
              Ready to <span className="text-primary">Take Control</span> of your denials?
            </h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              Join our growing network of forward-thinking billing teams already using our AI to simplify appeals, recover revenue faster, and cut down an manual work.
            </p>

            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <Card className="p-8 border-2 border-primary/20 hover:border-primary/30 transition-colors bg-white">
                <div className="text-center space-y-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Start Free Trial</h3>
                  <p className="text-muted-foreground text-sm">
                    Test our AI with 3 free analyses. No credit card required.
                  </p>
                  <Button size="lg" className="w-full bg-primary hover:bg-primary/90">
                    Try Free 
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </Card>

              <Card className="p-8 border-2 border-muted hover:border-primary/20 transition-colors bg-white">
                <div className="text-center space-y-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Talk to Our Team</h3>
                  <p className="text-muted-foreground text-sm">
                    Get a personalized demo and discuss your specific needs.
                  </p>

                   <Dialog >
      {/* Trigger — button to open dialog */}
      <DialogTrigger asChild>
                  <Button size="lg" variant="outline" className="w-full bg-transparent">
                    Schedule a Demo
                  </Button>
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
                </div>
              </Card>
            </div>

            <div className="mt-12 flex items-center justify-center space-x-8 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>No setup fees</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>HIPAA compliant</span>
              </div>
            </div>
          </div>
         
        </div>
      </section>
  );
};
