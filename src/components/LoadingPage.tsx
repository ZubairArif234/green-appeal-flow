import React from 'react';
import { Brain, FileText, CheckCircle, Sparkles, Loader2 } from 'lucide-react';

interface LoadingPageProps {
  isVisible: boolean;
  currentStep?: string;
  progress?: number;
}

const LoadingPage: React.FC<LoadingPageProps> = ({ 
  isVisible, 
  currentStep = "Processing your appeal...", 
  progress = 0 
}) => {
  if (!isVisible) return null;

  const steps = [
    { id: 1, title: "Uploading Files", description: "Extracting claim and denial data, validating formats, and preparing analysis", icon: FileText },
    { id: 2, title: "AI Analysis", description: "Reviewing denial codes, cross-checking with payer rules and CMS guidance", icon: Brain },
    { id: 3, title: "Generating Report", description: "Creating your personalized appeal strategy", icon: Sparkles },
    { id: 4, title: "Finalizing", description: "Preparing your analysis results", icon: CheckCircle }
  ];

  const currentStepIndex = Math.min(Math.floor(progress * steps.length), steps.length - 1);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary-light text-primary-foreground p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Brain className="w-8 h-8 text-white animate-pulse" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Analyzing Your Denial</h2>
              <p className="text-white/90 mt-1">Reviewing your documentation to identify next steps...</p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="p-6">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm text-gray-500">{Math.round(progress * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="progress-bar bg-gradient-to-r from-primary to-primary-light h-2 rounded-full"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </div>

          {/* Current Step */}
          <div className="mb-6">
            <div className="flex items-center space-x-3 p-4 bg-primary-50 rounded-xl border border-primary-200">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{currentStep}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  This may take a few moments depending on the complexity of your case
                </p>
              </div>
            </div>
          </div>

          {/* Steps List */}
          <div className="space-y-3">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = index < currentStepIndex;
              const isCurrent = index === currentStepIndex;
              const isPending = index > currentStepIndex;

              return (
                <div 
                  key={step.id}
                  className={`flex items-center space-x-4 p-3 rounded-xl transition-all duration-300 ${
                    isCompleted 
                      ? 'bg-primary-50 border border-primary-200 step-complete' 
                      : isCurrent 
                        ? 'bg-blue-50 border border-blue-200 step-current' 
                        : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${
                    isCompleted 
                      ? 'bg-primary-100' 
                      : isCurrent 
                        ? 'bg-blue-100' 
                        : 'bg-gray-100'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5 text-primary" />
                    ) : isCurrent ? (
                      <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                    ) : (
                      <Icon className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-medium ${
                      isCompleted 
                        ? 'text-primary-900' 
                        : isCurrent 
                          ? 'text-blue-900' 
                          : 'text-gray-500'
                    }`}>
                      {step.title}
                    </h4>
                    <p className={`text-sm ${
                      isCompleted 
                        ? 'text-primary-700' 
                        : isCurrent 
                          ? 'text-blue-700' 
                          : 'text-gray-400'
                    }`}>
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Additional Info */}
          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <div className="flex items-start space-x-3">
              <div className="p-1 bg-gray-200 rounded-lg">
                <Brain className="w-4 h-4 text-gray-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 text-sm">What's happening?</h4>
                <p className="text-sm text-gray-600 mt-1">
                 Our AI is reviewing your denial claim details, and supporting documentation. It cross-references payer rules and CMS guidance to generate structured recommendations for either correcting the claim or preparing an appeal.
                  </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
