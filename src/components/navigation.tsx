import { Button } from "@/components/ui/button";

export const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src="/logo.png" 
              alt="AI Medical Denial Assistant Logo" 
              className="h-10 w-auto"
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
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-black hover:text-primary transition-smooth font-medium">
              Features
            </a>
            <a href="#how-it-works" className="text-black hover:text-primary transition-smooth font-medium">
              How It Works
            </a>
            <a href="#pricing" className="text-black hover:text-primary transition-smooth font-medium">
              Pricing
            </a>
            <a href="#faq" className="text-black hover:text-primary transition-smooth font-medium">
              FAQ
            </a>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="hidden md:inline-flex">
              Sign In
            </Button>
            <Button className="bg-gradient-primary hover:opacity-90 shadow-button transition-smooth">
              Free Trial
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
