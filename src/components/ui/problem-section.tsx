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
              className="group p-6 rounded-2xl bg-card border border-border hover:shadow-card transition-smooth hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-smooth">
                <problem.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {problem.title}
              </h3>
              
              <p className="text-muted-foreground leading-relaxed">
                {problem.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};