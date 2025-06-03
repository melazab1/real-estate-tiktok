
interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabel: string;
}

export const ProgressIndicator = ({ currentStep, totalSteps, stepLabel }: ProgressIndicatorProps) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-blue-600">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-sm text-gray-500">
          {Math.round((currentStep / totalSteps) * 100)}% Complete
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>
      <p className="text-lg font-semibold mt-3">{stepLabel}</p>
    </div>
  );
};
