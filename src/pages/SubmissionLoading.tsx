
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { LoadingSpinner } from '@/components/loading/LoadingSpinner';
import { ProgressBar } from '@/components/loading/ProgressBar';
import { EstimatedTime } from '@/components/loading/EstimatedTime';
import { ProcessingSteps, type ProcessingStep } from '@/components/loading/ProcessingSteps';
import { LoadingMessages } from '@/components/loading/LoadingMessages';
import { useJobPolling } from '@/hooks/useJobPolling';
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

  const { job, progress, estimatedTimeRemaining, startPolling } = useJobPolling({
    displayId: identifier!,
    expectedStatus: 'reviewing',
    onStatusChange: (job) => {
      updateStepsBasedOnJob(job);
    },
    onComplete: (job) => {
      toast({
        title: "Success",
        description: "Property data extracted successfully!"
      });
      navigate(`/job/${identifier}/review`);
    },
    onError: (error) => {
      console.error('Polling error:', error);
      toast({
        title: "Error",
        description: "There was an issue processing your submission. Redirecting to review page.",
        variant: "destructive"
      });
      navigate(`/job/${identifier}/review`);
    },
    maxDuration: 3 * 60 * 1000 // 3 minutes for submission
  });

  const updateStepsBasedOnJob = (job: any) => {
    setSteps(prevSteps => {
      const newSteps = [...prevSteps];
      
      // Update steps based on job status
      if (job.status === 'analyzing') {
        newSteps[0].status = 'completed';
        newSteps[1].status = 'active';
      } else if (job.status === 'reviewing') {
        newSteps[0].status = 'completed';
        newSteps[1].status = 'completed';
        newSteps[2].status = 'active';
      }
      
      return newSteps;
    });
  };

  useEffect(() => {
    if (identifier) {
      startPolling();
    }
  }, [identifier]);

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
                We're analyzing your property URL and extracting the information.
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
                timeRemaining={estimatedTimeRemaining}
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
