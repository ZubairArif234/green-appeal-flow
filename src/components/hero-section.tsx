import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Play } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

export const HeroSection = () => {
  return (
    <section className="min-h-screen flex items-center bg-white relative overflow-hidden">
      {/* Left side background with green shades */}
      <div className="absolute left-0 top-0 w-1/2 h-full">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-primary/5 to-primary/3"></div>
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-primary/10 blur-3xl"></div>
        <div className="absolute bottom-32 left-20 w-24 h-24 rounded-full bg-primary/15 blur-2xl"></div>
        <div className="absolute top-1/2 left-32 w-40 h-40 rounded-full bg-primary/5 blur-3xl"></div>
      </div>
      
      {/* Corner decorative elements - where you drew the lines */}
      {/* Bottom left corner */}
      <div className="absolute bottom-0 left-0 w-96 h-96">
        <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-tr from-primary/15 via-primary/8 to-transparent rounded-tr-full"></div>
        <div className="absolute bottom-10 left-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 left-32 w-24 h-24 bg-primary/25 rounded-full blur-xl"></div>
      </div>
      
      {/* Right side background with green shades - top section */}
      <div className="absolute right-0 top-0 w-1/2 h-full">
        <div className="absolute inset-0 bg-gradient-to-bl from-primary/6 via-primary/3 to-primary/1"></div>
        <div className="absolute top-16 right-16 w-36 h-36 rounded-full bg-primary/8 blur-3xl"></div>
        <div className="absolute top-32 right-32 w-28 h-28 rounded-full bg-primary/12 blur-2xl"></div>
        <div className="absolute top-1/3 right-20 w-44 h-44 rounded-full bg-primary/4 blur-3xl"></div>
      </div>
      
      {/* Top right corner */}
      <div className="absolute top-0 right-0 w-80 h-80">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-primary/15 via-primary/8 to-transparent rounded-bl-full"></div>
        <div className="absolute top-8 right-8 w-28 h-28 bg-primary/20 rounded-full blur-2xl"></div>
        <div className="absolute top-16 right-24 w-20 h-20 bg-primary/25 rounded-full blur-xl"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8 relative">
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
                <CheckCircle className="w-4 h-4 text-primary mr-2" />
                <span className="text-sm font-semibold text-primary">A Product of Cove Health</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Transform
                <span className="text-primary block">Medical Denials</span>
                <span className="text-gray-700">into Success</span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                Get instant AI guidance for medical claim appeals. Turn complex denials into clear, 
                actionable insights with our HIPAA-compliant platform.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary-dark text-white shadow-lg transition-all duration-300 text-lg px-8 py-4 rounded-xl group"
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-gray-300 text-gray-700 hover:border-primary hover:text-primary transition-all duration-300 text-lg px-8 py-4 rounded-xl group"
              >
                <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                Watch Demo
              </Button>
            </div>
            
            {/* Trust indicators */}
            <div className="flex flex-wrap gap-8 pt-6">
              <div className="flex items-center gap-2 text-gray-600">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm font-medium">HIPAA Compliant</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm font-medium">No PHI Required</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm font-medium">Built for Providers</span>
              </div>
            </div>
          </div>
          
          {/* Right Column - Image */}
          <div className="relative lg:ml-8">
            <div className="relative">
              {/* Background decorative elements */}
              <div className="absolute -top-4 -right-4 w-full h-full rounded-3xl bg-gradient-to-br from-primary/10 to-primary/20 blur-sm"></div>
              
              {/* Main image */}
              <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                <img 
                  src={heroImage} 
                  alt="AI Medical Denial Assistant Dashboard"
                  className="w-full h-auto object-cover"
                />
              </div>
              
              {/* Floating elements */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-gray-700">95% Success Rate</span>
                </div>
              </div>
              
              <div className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">3x</div>
                  <div className="text-xs text-gray-600">Faster Appeals</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
