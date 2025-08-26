import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";

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
