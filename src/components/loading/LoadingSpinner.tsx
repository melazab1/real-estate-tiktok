
import { BeatLoader, PulseLoader, ScaleLoader } from 'react-spinners';

interface LoadingSpinnerProps {
  type?: 'beat' | 'pulse' | 'scale';
  color?: string;
  size?: number;
  className?: string;
}

export const LoadingSpinner = ({ 
  type = 'pulse', 
  color = '#3B82F6', 
  size = 15,
  className = ''
}: LoadingSpinnerProps) => {
  const spinnerProps = {
    color,
    size,
    loading: true
  };

  const renderSpinner = () => {
    switch (type) {
      case 'beat':
        return <BeatLoader {...spinnerProps} />;
      case 'scale':
        return <ScaleLoader {...spinnerProps} />;
      case 'pulse':
      default:
        return <PulseLoader {...spinnerProps} />;
    }
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      {renderSpinner()}
    </div>
  );
};
