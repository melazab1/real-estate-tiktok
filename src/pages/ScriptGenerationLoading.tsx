
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

  const { job, progress, estimatedTimeRemaining, startPolling } = useJobPolling({
    displayId: identifier!,
    expectedStatus: 'script_ready',
    onStatusChange: (job) => {
      updateStepsBasedOnJob(job);
    },
    onComplete: (job) => {
      toast({
        title: "Success",
        description: "Script generated successfully!"
      });
      navigate(`/job/${identifier}/script`);
    },
    onError: (error) => {
      console.error('Polling error:', error);
      toast({
        title: "Error",
        description: "There was an issue generating the script. Redirecting to script page.",
        variant: "destructive"
      });
      navigate(`/job/${identifier}/script`);
    },
    maxDuration: 4 * 60 * 1000 // 4 minutes for script generation
  });

  const updateStepsBasedOnJob = (job: any) => {
    setSteps(prevSteps => {
      const newSteps = [...prevSteps];
      
      if (job.status === 'generating_script') {
        newSteps[0].status = 'completed';
        newSteps[1].status = 'active';
      } else if (job.status === 'script_ready') {
        newSteps.forEach((step, index) => {
          if (index < 3) step.status = 'completed';
          else step.status = 'active';
        });
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
                Our AI is crafting an engaging script for your property video.
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
                timeRemaining={estimatedTimeRemaining}
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
