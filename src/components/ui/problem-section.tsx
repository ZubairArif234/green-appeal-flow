import { TrendingDown, Clock, DollarSign, AlertTriangle } from "lucide-react";

export const ProblemSection = () => {
  const problems = [
    {
      icon: TrendingDown,
      title: "Rising Denial Rates",
      description: "Medical claim denials have increased by 23% over the past 3 years, eating into provider revenue."
    },
    {
      icon: Clock,
      title: "Time-Consuming Appeals",
      description: "Staff spend hours researching denial codes and crafting appeals instead of focusing on patient care."
    },
    {
      icon: DollarSign,
      title: "Lost Revenue",
      description: "Providers lose an average of $5M annually due to unresolved denials and missed appeal deadlines."
    },
    {
      icon: AlertTriangle,
      title: "Complex Guidelines",
      description: "CMS and AMA guidelines are complex and ever-changing, making it hard to stay compliant."
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center space-y-6 mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
            Why Medical Providers 
            <span className="text-primary block">Struggle with Denials</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            The healthcare industry faces mounting pressure from increasing denial rates and complex appeal processes.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {problems.map((problem, index) => (
            <div 
              key={index}
              className="group p-8 rounded-3xl bg-primary border border-primary/20 hover:shadow-elegant transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-dark opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                  <problem.icon className="w-8 h-8 text-white drop-shadow-sm" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-white/95 transition-colors duration-300">
                  {problem.title}
                </h3>
                
                <p className="text-white/90 leading-relaxed text-base group-hover:text-white transition-colors duration-300">
                  {problem.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};