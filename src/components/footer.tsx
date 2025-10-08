import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";


export const Footer = () => {
  return (
    <footer className="py-16 bg-background border-t border-border">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img 
                src="/logo.png" 
                alt="AI Medical Denial Assistant Logo" 
                className="h-8 w-auto"
                onError={(e) => {
                  // Fallback to original design if logo doesn't exist
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                  if (fallback) {
                    fallback.classList.remove('hidden');
                    fallback.classList.add('flex');
                  }
                }}
              />
              <div className="hidden w-8 h-8 rounded-lg bg-gradient-primary items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">AI</span>
              </div>
              
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

export const Footer2 = () => {
  return (
   <footer className="border-t bg-background">
        <div className="container py-12">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="">
              <Link to="/" className="flex items-center space-x-2 mb-4">
                <div className=" rounded-lg  flex items-center justify-center">
                   <img 
                src="/logo.png" 
                alt="AI Medical Denial Assistant Logo" 
                className="h-16 w-auto"
                onError={(e) => {
                  // Fallback to original design if logo doesn't exist
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                  if (fallback) {
                    fallback.classList.remove('hidden');
                    fallback.classList.add('flex');
                  }
                }}
              />
                </div>
                {/* <span className="font-bold text-xl">Deniel Management</span> */}
              </Link>
              <p className="text-muted-foreground max-w-md">
                Transforming healthcare revenue cycle management with AI-powered solutions and expert guidance.
              </p>
            </div>

            <div>
              {/* <h3 className="font-semibold mb-4">Solutions</h3> */}
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/privacy-policy" className="hover:text-primary">
                   Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms-conditions" className="hover:text-primary">
                    Terms of use
                  </Link>
                </li>
                <li>
                 Contact Email : <a>info@covehealthsolutions.com</a>
                </li>
               
              </ul>
            </div>

         
          </div>

          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Cove Health. All rights reserved.</p>
          </div>
        </div>
      </footer>
  );
};
