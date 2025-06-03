
import { Progress } from '@/components/ui/progress';

interface ProgressBarProps {
  progress: number;
  showPercentage?: boolean;
  className?: string;
  label?: string;
}

export const ProgressBar = ({ 
  progress, 
  showPercentage = true, 
  className = '',
  label 
}: ProgressBarProps) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>{label}</span>
          {showPercentage && <span>{Math.round(progress)}%</span>}
        </div>
      )}
      <Progress value={progress} className="h-2" />
    </div>
  );
};
