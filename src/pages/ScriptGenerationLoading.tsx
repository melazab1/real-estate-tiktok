
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

const ScriptGenerationLoading = () => {
  const { identifier } = useParams<{ identifier: string }>();
  const navigate = useNavigate();
  
  const [steps, setSteps] = useState<ProcessingStep[]>([
    { id: 'analyze', label: 'Analyzing Property Data', status: 'active', description: 'Processing property information' },
    { id: 'generate', label: 'Generating Script', status: 'pending', description: 'Creating engaging video script' },
    { id: 'optimize', label: 'Optimizing Content', status: 'pending', description: 'Refining script for maximum impact' },
    { id: 'finalize', label: 'Finalizing Script', status: 'pending', description: 'Preparing script for review' }
  ]);

  const loadingMessages = [
    "Analyzing your property data...",
    "Crafting an engaging script...",
    "Optimizing content for your audience...",
    "Adding the finishing touches...",
    "Almost ready for your review!"
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
      if (job.status === 'script_ready') {
        toast({
          title: "Success",
          description: "Script generated successfully!"
        });
        navigate(`/job/${identifier}/script`);
      } else if (job.status === 'failed') {
        toast({
          title: "Error",
          description: errorDetails || "There was an issue generating the script.",
          variant: "destructive"
        });
        navigate(`/job/${identifier}/script`);
      }
    },
    onError: (error) => {
      console.error('Real-time error:', error);
      toast({
        title: "Error",
        description: "Connection error. Redirecting to script page.",
        variant: "destructive"
      });
      navigate(`/job/${identifier}/script`);
    }
  });

  const updateStepsBasedOnJob = (job: any) => {
    setSteps(prevSteps => {
      const newSteps = [...prevSteps];
      
      // Update steps based on progress percentage
      const progressSteps = Math.floor(progress / 25); // Each step represents ~25% progress
      
      newSteps.forEach((step, index) => {
        if (index < progressSteps) {
          step.status = 'completed';
        } else if (index === progressSteps) {
          step.status = 'active';
        } else {
          step.status = 'pending';
        }
      });
      
      return newSteps;
    });
  };

  const getEstimatedTime = (): number | null => {
    if (!estimatedCompletion) return null;
    const remaining = estimatedCompletion.getTime() - Date.now();
    return Math.max(0, Math.floor(remaining / 1000));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center">
        <LoadingSpinner type="scale" size={15} color="#8B5CF6" className="mb-4" />
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Script Generation Error</h2>
          <p className="text-gray-600">{errorDetails || "An error occurred while generating the script."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <Navigation />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <LoadingSpinner type="scale" size={15} color="#8B5CF6" className="mb-4" />
              <h1 className="text-2xl font-bold text-gray-900">
                Generating Your Script
              </h1>
              <p className="text-gray-600">
                {detailedStatus}
              </p>
            </div>

            {/* Progress */}
            <div className="space-y-4">
              <ProgressBar 
                progress={progress} 
                label="Script Generation Progress"
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
              interval={3000}
              className="pt-4 border-t"
            />

            {/* Tips for mobile */}
            <div className="bg-purple-50 rounded-lg p-4 text-sm text-purple-700 md:hidden">
              💡 <strong>Tip:</strong> The script will be fully customizable once generated!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScriptGenerationLoading;
