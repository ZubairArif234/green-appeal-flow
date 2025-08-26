import { Zap, Shield, Users, Clock } from "lucide-react";

export const BenefitsSection = () => {
  const benefits = [
    {
      number: "01",
      icon: Zap,
      title: "Faster Approvals",
      description: "Get your appeals processed 3x faster with AI-powered guidance and automated documentation.",
      image: "/api/placeholder/300/200"
    },
    {
      number: "02", 
      icon: Shield,
      title: "HIPAA-Conscious Workflow",
      description: "Built with privacy in mind. Our system works with redacted documents, no PHI required.",
      image: "/api/placeholder/300/200"
    },
    {
      number: "03",
      icon: Users,
      title: "Built for Providers",
      description: "Designed by healthcare professionals who understand the unique challenges of medical billing.",
      image: "/api/placeholder/300/200"
    },
    {
      number: "04",
      icon: Clock,
      title: "No PHI Required",
      description: "Upload redacted screenshots and documents. Our AI works without accessing sensitive patient data.",
      image: "/api/placeholder/300/200"
    }
  ];

  return (
    <section id="features" className="py-20 bg-gradient-to-br from-primary/5 to-primary/10 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 80%, hsl(136 24% 36% / 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 80% 20%, hsl(136 24% 36% / 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 40% 40%, hsl(136 24% 36% / 0.05) 0%, transparent 50%)`
        }}></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Column - Title and Description */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                Why Choose Our
                <span className="text-primary block">AI Assistant</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Streamline your denial appeal process with intelligent automation and expert guidance. 
                Our AI-powered platform transforms complex medical denials into clear, actionable insights.
              </p>
            </div>
            
            {/* Decorative Healthcare Images */}
            <div className="grid grid-cols-2 gap-4 max-w-sm">
              <div className="aspect-[4/3] rounded-2xl bg-white shadow-card border border-primary/10 overflow-hidden">
                <img 
                  src="/medical-dashboard.svg" 
                  alt="Medical Dashboard Interface"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-[4/3] rounded-2xl bg-white shadow-card border border-primary/10 overflow-hidden">
                <img 
                  src="/medical-document.svg" 
                  alt="Medical Document Processing"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="col-span-2 aspect-[2/1] rounded-2xl bg-gradient-to-r from-primary/10 to-primary/20 p-6 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <Zap className="w-12 h-12 text-primary mx-auto" />
                  <p className="text-sm font-semibold text-primary">AI-Powered Analysis</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - 2x2 Grid of Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="group relative bg-white rounded-3xl p-8 shadow-card hover:shadow-elegant transition-all duration-500 hover:-translate-y-2 border border-primary/10"
              >
                {/* Number Badge */}
                <div className="absolute -top-3 -left-3 w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">{benefit.number}</span>
                </div>
                
                {/* Content */}
                <div className="space-y-4 pt-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center group-hover:scale-110 transition-smooth">
                    <benefit.icon className="w-8 h-8 text-primary" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-foreground">
                    {benefit.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {benefit.description}
                  </p>
                </div>
                
                {/* Subtle background decoration */}
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-primary/5 to-transparent rounded-3xl"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
