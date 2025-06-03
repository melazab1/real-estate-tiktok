
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { LoadingSpinner } from '@/components/loading/LoadingSpinner';
import { ProgressBar } from '@/components/loading/ProgressBar';
import { EstimatedTime } from '@/components/loading/EstimatedTime';
import { ProcessingSteps, type ProcessingStep } from '@/components/loading/ProcessingSteps';
import { LoadingMessages } from '@/components/loading/LoadingMessages';
import { useJobRealtime } from '@/hooks/useJobRealtime';
import { toast } from '@/hooks/use-toast';

const SubmissionLoading = () => {
  const { identifier } = useParams<{ identifier: string }>();
  const navigate = useNavigate();
  
  const [steps, setSteps] = useState<ProcessingStep[]>([
    { id: 'submit', label: 'Submitting URL', status: 'active', description: 'Processing your property URL' },
    { id: 'extract', label: 'Extracting Property Data', status: 'pending', description: 'Analyzing property information' },
    { id: 'prepare', label: 'Preparing Review', status: 'pending', description: 'Setting up data for review' }
  ]);

  const loadingMessages = [
    "Analyzing your property URL...",
    "Extracting property details...",
    "Processing images and data...",
    "Almost ready for review..."
  ];

  const {
    job,
    loading,
    progress,
    detailedStatus,
    estimatedCompletion,
    hasError,
    errorDetails
  } = useJobRealtime({
    displayId: identifier!,
    onStatusChange: (job) => {
      updateStepsBasedOnJob(job);
    },
    onComplete: (job) => {
      if (job.status === 'reviewing') {
        toast({
          title: "Success",
          description: "Property data extracted successfully!"
        });
        navigate(`/job/${identifier}/review`);
      } else if (job.status === 'failed') {
        toast({
          title: "Error",
          description: errorDetails || "There was an issue processing your submission.",
          variant: "destructive"
        });
        navigate(`/job/${identifier}/review`);
      }
    },
    onError: (error) => {
      console.error('Real-time error:', error);
      toast({
        title: "Error",
        description: "Connection error. Redirecting to review page.",
        variant: "destructive"
      });
      navigate(`/job/${identifier}/review`);
    }
  });

  const updateStepsBasedOnJob = (job: any) => {
    setSteps(prevSteps => {
      const newSteps = [...prevSteps];
      
      // Update steps based on job status and progress
      if (job.status === 'analyzing') {
        newSteps[0].status = 'completed';
        newSteps[1].status = 'active';
      } else if (job.status === 'reviewing' || job.progress_percentage >= 40) {
        newSteps[0].status = 'completed';
        newSteps[1].status = 'completed';
        newSteps[2].status = 'active';
      }
      
      return newSteps;
    });
  };

  const getEstimatedTime = (): number | null => {
    if (!estimatedCompletion) return null;
    const remaining = estimatedCompletion.getTime() - Date.now();
    return Math.max(0, Math.floor(remaining / 1000)); // Convert to seconds
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <LoadingSpinner size={20} className="mb-4" />
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing Error</h2>
          <p className="text-gray-600">{errorDetails || "An error occurred while processing your submission."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <LoadingSpinner type="pulse" size={20} className="mb-4" />
              <h1 className="text-2xl font-bold text-gray-900">
                Processing Your Submission
              </h1>
              <p className="text-gray-600">
                {detailedStatus}
              </p>
            </div>

            {/* Progress */}
            <div className="space-y-4">
              <ProgressBar 
                progress={progress} 
                label="Overall Progress"
                className="mb-6"
              />
              
              <EstimatedTime 
                timeRemaining={getEstimatedTime()}
                className="justify-center"
              />
            </div>

            {/* Processing Steps */}
            <ProcessingSteps steps={steps} />

            {/* Loading Messages */}
            <LoadingMessages 
              messages={loadingMessages}
              interval={2500}
              className="pt-4 border-t"
            />

            {/* Mobile optimization */}
            <div className="text-xs text-gray-500 text-center md:hidden">
              This may take a few moments on mobile devices
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionLoading;
