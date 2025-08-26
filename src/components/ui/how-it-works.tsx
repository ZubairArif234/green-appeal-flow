import { Upload, Brain, FileText, CheckCircle } from "lucide-react";

export const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      icon: Upload,
      title: "Upload Denial Documents",
      description: "Simply upload your denial documents or screenshots. Our system accepts PDFs, images, and scanned documents.",
      details: "No PHI required - redacted screenshots work perfectly"
    },
    {
      number: "02", 
      icon: Brain,
      title: "AI Analyzes & Provides Guidance",
      description: "Our AI engine processes your denial using advanced coding logic grounded in CMS and AMA guidelines.",
      details: "Get plain-English summaries, required corrections, and staff-ready instructions in seconds"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-6">
        <div className="text-center space-y-6 mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
            How It 
            <span className="text-primary"> Works</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your denial appeal process in two simple steps
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Connection Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border transform -translate-x-0.5 hidden lg:block"></div>
            
            {steps.map((step, index) => (
              <div 
                key={index}
                className={`flex items-center gap-8 mb-16 ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                }`}
              >
                {/* Content */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                      STEP {step.number}
                    </span>
                  </div>
                  
                  <h3 className="text-3xl font-bold text-foreground">
                    {step.title}
                  </h3>
                  
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                  
                  <div className="flex items-center gap-2 text-primary">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">{step.details}</span>
                  </div>
                </div>
                
                {/* Icon */}
                <div className="flex-shrink-0 relative">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-elegant">
                    <step.icon className="w-12 h-12 text-primary-foreground" />
                  </div>
                  
                  {/* Step number background */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                    {step.number}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};