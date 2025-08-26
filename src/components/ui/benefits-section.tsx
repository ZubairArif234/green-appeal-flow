import { Zap, Shield, Users, Clock } from "lucide-react";

export const BenefitsSection = () => {
  const benefits = [
    {
      icon: Zap,
      title: "Faster Approvals",
      description: "Get your appeals processed 3x faster with AI-powered guidance and automated documentation."
    },
    {
      icon: Shield,
      title: "HIPAA-Conscious Workflow", 
      description: "Built with privacy in mind. Our system works with redacted documents, no PHI required."
    },
    {
      icon: Users,
      title: "Built for Providers",
      description: "Designed by healthcare professionals who understand the unique challenges of medical billing."
    },
    {
      icon: Clock,
      title: "No PHI Required",
      description: "Upload redacted screenshots and documents. Our AI works without accessing sensitive patient data."
    }
  ];

  return (
    <section id="features" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center space-y-6 mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
            Why Choose Our
            <span className="text-primary block">AI Assistant</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Streamline your denial appeal process with intelligent automation and expert guidance.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="group text-center space-y-4 p-8 rounded-2xl hover:bg-card hover:shadow-card transition-smooth hover:-translate-y-2"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto group-hover:scale-110 transition-smooth">
                <benefit.icon className="w-8 h-8 text-primary-foreground" />
              </div>
              
              <h3 className="text-xl font-semibold text-foreground">
                {benefit.title}
              </h3>
              
              <p className="text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};