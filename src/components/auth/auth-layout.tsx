import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex bg-white relative overflow-hidden">
      {/* Left side - Decorative background */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        {/* Background gradients matching hero section */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-primary/5 to-primary/3"></div>
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-primary/10 blur-3xl"></div>
        <div className="absolute bottom-32 left-20 w-24 h-24 rounded-full bg-primary/15 blur-2xl"></div>
        <div className="absolute top-1/2 left-32 w-40 h-40 rounded-full bg-primary/5 blur-3xl"></div>
        
        {/* Bottom left corner decoration */}
        <div className="absolute bottom-0 left-0 w-96 h-96">
          <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-tr from-primary/15 via-primary/8 to-transparent rounded-tr-full"></div>
          <div className="absolute bottom-10 left-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 left-32 w-24 h-24 bg-primary/25 rounded-full blur-xl"></div>
        </div>
        
        {/* Top right decoration */}
        <div className="absolute top-0 right-0 w-80 h-80">
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-primary/15 via-primary/8 to-transparent rounded-bl-full"></div>
          <div className="absolute top-8 right-8 w-28 h-28 bg-primary/20 rounded-full blur-2xl"></div>
          <div className="absolute top-16 right-24 w-20 h-20 bg-primary/25 rounded-full blur-xl"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16">
          <div className="max-w-md">
             <Link to={"/"}>
                        <img 
                          src="/logo.png" 
                          alt="AI Medical Denial Assistant Logo" 
                          className="h-[6rem] w-auto"
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
                       </Link>
            <p className="text-lg ms-4 text-gray-600 leading-relaxed">
              Transform medical denials into success with our AI-powered platform. 
             
            </p>
            {/* <div className="flex flex-wrap gap-6 mt-8">
              <div className="flex items-center gap-2 text-gray-600">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm font-medium">HIPAA Compliant</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm font-medium">No PHI Required</span>
              </div>
            </div> */}
          </div>
        </div>
      </div>
      
      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-md space-y-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};
