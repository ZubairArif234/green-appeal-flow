import aiDashboard from "@/assets/ai-dashboard.jpg";
import medicalDocuments from "@/assets/medical-documents.jpg";
import healthcareTablet from "@/assets/healthcare-tablet.jpg";

export const WhyChooseSection = () => {
  const benefits = [
    {
      number: "01",
      title: "HIPAA Compliant",
      description: "Work with redacted documents safely. No PHI required - our system analyzes denial patterns while protecting patient privacy."
    },
    {
      number: "02", 
      title: "Instant Analysis",
      description: "Get immediate insights and appeal guidance. Our AI processes complex medical coding and guidelines in seconds, not hours."
    },
    {
      number: "03",
      title: "Proven Results", 
      description: "Increase your appeal success rate by 40%. Our AI is trained on thousands of successful appeals and current CMS guidelines."
    },
    {
      number: "04",
      title: "Staff Efficiency",
      description: "Free your team to focus on patient care. Reduce time spent on denial research from hours to minutes with automated guidance."
    }
  ];

  return (
    <section className="py-20 bg-primary/10 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Images */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                Why Choose Our
                <span className="text-primary block">AI Assistant</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
                Transform your denial management process with intelligent automation designed specifically for healthcare providers.
              </p>
            </div>
            
            {/* Image Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden shadow-elegant hover:shadow-xl transition-all duration-500 hover:scale-105">
                  <img 
                    src={aiDashboard} 
                    alt="AI Dashboard Interface" 
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-elegant hover:shadow-xl transition-all duration-500 hover:scale-105">
                  <img 
                    src={healthcareTablet} 
                    alt="Healthcare Professional with Tablet" 
                    className="w-full h-40 object-cover"
                  />
                </div>
              </div>
              <div className="pt-8">
                <div className="rounded-2xl overflow-hidden shadow-elegant hover:shadow-xl transition-all duration-500 hover:scale-105">
                  <img 
                    src={medicalDocuments} 
                    alt="Medical Documents Analysis" 
                    className="w-full h-56 object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Side - Benefits */}
          <div className="space-y-8">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="group hover:translate-x-2 transition-all duration-500"
              >
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-all duration-300">
                      {benefit.number}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                      {benefit.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </p>
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