
import { CheckCircle, Circle, Loader2 } from 'lucide-react';

interface ProcessingStep {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'completed';
  description?: string;
}

interface ProcessingStepsProps {
  steps: ProcessingStep[];
  className?: string;
}

export const ProcessingSteps = ({ steps, className = '' }: ProcessingStepsProps) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            {step.status === 'completed' && (
              <CheckCircle className="h-5 w-5 text-green-500" />
            )}
            {step.status === 'active' && (
              <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
            )}
            {step.status === 'pending' && (
              <Circle className="h-5 w-5 text-gray-300" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className={`text-sm font-medium ${
              step.status === 'completed' ? 'text-green-700' :
              step.status === 'active' ? 'text-blue-700' :
              'text-gray-400'
            }`}>
              {step.label}
            </div>
            {step.description && (
              <div className="text-xs text-gray-500 mt-1">
                {step.description}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
