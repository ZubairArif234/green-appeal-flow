import { Separator } from "@/components/ui/separator";

export const Footer = () => {
  return (
    <footer className="py-16 bg-background border-t border-border">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">AI</span>
              </div>
              <span className="text-lg font-bold text-foreground">Medical Denial Assistant</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Transforming medical claim denials into successful appeals with AI-powered guidance.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide">Product</h4>
            <div className="space-y-2">
              <a href="#features" className="block text-sm text-muted-foreground hover:text-foreground transition-smooth">Features</a>
              <a href="#how-it-works" className="block text-sm text-muted-foreground hover:text-foreground transition-smooth">How It Works</a>
              <a href="#pricing" className="block text-sm text-muted-foreground hover:text-foreground transition-smooth">Pricing</a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-smooth">Integrations</a>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide">Support</h4>
            <div className="space-y-2">
              <a href="#faq" className="block text-sm text-muted-foreground hover:text-foreground transition-smooth">FAQ</a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-smooth">Documentation</a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-smooth">Contact Support</a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-smooth">Training</a>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide">Company</h4>
            <div className="space-y-2">
              <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-smooth">About Us</a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-smooth">Privacy Policy</a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-smooth">Terms of Service</a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-smooth">HIPAA Compliance</a>
            </div>
          </div>
        </div>
        
        <Separator className="mb-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 AI Medical Denial Assistant. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            HIPAA-compliant • SOC 2 certified • Healthcare-focused
          </p>
        </div>
      </div>
    </footer>
  );
};