import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

export const HeroSection = () => {
  return (
    <section className="pt-24 pb-16 bg-gradient-hero min-h-screen flex items-center">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <CheckCircle className="w-4 h-4 text-primary mr-2" />
              <span className="text-sm font-medium text-primary">AI-Powered Denial Analysis</span>
            </div>
            
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Turn Medical
                <span className="text-primary block">Denials into</span>
                <span className="bg-gradient-primary bg-clip-text text-transparent">Approvals</span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                Submit your denial and get instant AI-powered appeal guidance. Plain-English summaries, 
                required corrections, and staff-ready instructions—all HIPAA-conscious and PHI-free.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-primary hover:opacity-90 shadow-button transition-smooth text-lg px-8 py-6"
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-primary text-primary hover:bg-primary/5 transition-smooth text-lg px-8 py-6"
              >
                Watch Demo
              </Button>
            </div>
            
            <div className="flex items-center space-x-6 pt-4">
              <div className="text-sm text-muted-foreground">
                ✓ No PHI required
              </div>
              <div className="text-sm text-muted-foreground">
                ✓ HIPAA-conscious workflow
              </div>
              <div className="text-sm text-muted-foreground">
                ✓ Built for providers
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-primary rounded-3xl blur-3xl opacity-20 scale-105"></div>
            <img 
              src={heroImage} 
              alt="AI-powered medical denial analysis dashboard"
              className="relative rounded-3xl shadow-elegant w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};