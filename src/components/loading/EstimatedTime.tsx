
import { Clock } from 'lucide-react';

interface EstimatedTimeProps {
  timeRemaining: number | null;
  className?: string;
}

export const EstimatedTime = ({ timeRemaining, className = '' }: EstimatedTimeProps) => {
  const formatTime = (milliseconds: number): string => {
    const seconds = Math.ceil(milliseconds / 1000);
    
    if (seconds < 60) {
      return `${seconds} second${seconds !== 1 ? 's' : ''}`;
    }
    
    const minutes = Math.ceil(seconds / 60);
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  };

  if (!timeRemaining || timeRemaining <= 0) {
    return null;
  }

  return (
    <div className={`flex items-center gap-2 text-sm text-gray-600 ${className}`}>
      <Clock className="h-4 w-4" />
      <span>Estimated time remaining: {formatTime(timeRemaining)}</span>
    </div>
  );
};
