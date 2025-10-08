import { FileText, Brain, CheckCircle, BarChart3, Target, Lightbulb, Clock } from "lucide-react";

export const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      icon: FileText,
      title: "Upload Denial Documents",
      description: "Simply upload your denial documents or screenshots. Our system accepts PDFs, images, and scanned documents.",
      details: "No PHI required - redacted screenshots work perfectly",
      gradient: "from-primary to-primary-dark"
    },
    {
      number: "02", 
      icon: Brain,
      title: "AI Analyzes & Provides Guidance",
      description: "Our AI engine processes your denial using advanced coding logic grounded in CMS and AMA guidelines.",
      details: "Get plain-English summaries, required corrections, and staff-ready instructions in seconds",
      gradient: "from-primary-dark to-primary"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gradient-subtle relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center space-y-6 mb-20">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
            How It 
            <span className="text-primary"> Works</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your denial appeal process with our streamlined AI-powered workflow
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto relative">
          {/* Curved Path */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg 
              width="100%" 
              height="400" 
              viewBox="0 0 800 400" 
              className="hidden lg:block"
            >
              <path
                d="M 100 350 Q 200 100 400 200 Q 600 300 700 50"
                stroke="hsl(var(--primary))"
                strokeWidth="3"
                fill="none"
                strokeDasharray="8,8"
                className="opacity-30"
              />
            </svg>
          </div>
          
          <div className="relative z-10 lg:grid lg:grid-cols-2 lg:gap-16 space-y-16 lg:space-y-0">
            {steps.map((step, index) => (
              <div 
                key={index}
                className={`flex flex-col items-center text-center space-y-6 ${
                  index === 0 ? 'lg:mt-32' : 'lg:mt-8'
                }`}
              >
                {/* Premium Icon Circle */}
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-white shadow-2xl border border-gray-100 flex items-center justify-center group hover:scale-105 transition-all duration-300">
                    <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg`}>
                      <step.icon className="w-10 h-10 text-white" strokeWidth={2} />
                    </div>
                  </div>
                  
                  {/* Premium Step Number */}
                  <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-white border-2 border-primary text-primary text-lg font-bold flex items-center justify-center shadow-lg">
                    {step.number}
                  </div>
                </div>
                
                {/* Premium Content Card */}
                <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 max-w-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  <div className="space-y-6">
                    <div className="inline-flex items-center justify-center w-full">
                      <span className="text-sm font-bold text-primary bg-primary/10 px-4 py-2 rounded-full">
                        STEP {step.number}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 text-center">
                      {step.title}
                    </h3>
                    
                    <p className="text-gray-600 leading-relaxed text-center">
                      {step.description}
                    </p>
                    
                    <div className="flex items-center gap-2 text-primary justify-center pt-2">
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-sm font-semibold">{step.details}</span>
                    </div>
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

export const HowItWorks2 = () => {
  

  return (
    <section className="py-20 bg-gradient-light-green">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance mb-6 text-foreground">
              Why Choose Our <span className="text-primary">AI Assistant</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
             Streamline your denial resolution process with intelligent automation and expert-built tools. Our AI platform breaks down complex denials into clear, actionable appeal strategies - in minutes, not days.
              </p>
          </div>

          {/* <div className="grid lg:grid-cols-2 gap-16 items-center px-14">
            <div className="space-y-8">
              <div className="flex items-start space-x-6">
                <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/20">
                  <span className="text-primary font-bold text-lg">01</span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg text-foreground">Faster Approvals</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Get your appeals processed 3x faster with AI-powered guidance and automated documentation.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/20">
                  <span className="text-primary font-bold text-lg">02</span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg text-foreground">HIPAA-Conscious Workflow</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Built with privacy in mind. Our system works with redacted documents, no PHI required.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/20">
                  <span className="text-primary font-bold text-lg">03</span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg text-foreground">Built for Providers</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Designed by healthcare professionals who understand the unique challenges of medical billing.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/20">
                  <span className="text-primary font-bold text-lg">04</span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg text-foreground">No PHI Required</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Upload redacted screenshots and documents. Our AI works without accessing sensitive patient data.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-primary rounded-2xl p-8 text-white">
                <div className="flex items-center justify-center mb-6">
                  <div className="h-16 w-16 rounded-lg bg-white/20 flex items-center justify-center">
                    <Brain className="h-8 w-8" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-center mb-4">AI-Powered Analysis</h3>
                <div className="space-y-4">
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <BarChart3 className="h-4 w-4" />
                      <span className="text-sm font-medium">Pattern Recognition</span>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full">
                      <div className="h-2 bg-accent rounded-full w-4/5"></div>
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="h-4 w-4" />
                      <span className="text-sm font-medium">Root Cause Analysis</span>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full">
                      <div className="h-2 bg-accent rounded-full w-3/4"></div>
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Lightbulb className="h-4 w-4" />
                      <span className="text-sm font-medium">Actionable Insights</span>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full">
                      <div className="h-2 bg-accent rounded-full w-5/6"></div>
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm font-medium">Time to Appeal</span>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full">
                      <div className="h-2 bg-accent rounded-full w-[90%]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </section>
  );
};
