
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

const VideoGenerationLoading = () => {
  const { identifier } = useParams<{ identifier: string }>();
  const navigate = useNavigate();
  
  const [steps, setSteps] = useState<ProcessingStep[]>([
    { id: 'voice', label: 'Processing Voice', status: 'active', description: 'Generating AI voiceover' },
    { id: 'visuals', label: 'Creating Visuals', status: 'pending', description: 'Assembling property images' },
    { id: 'sync', label: 'Synchronizing Audio & Video', status: 'pending', description: 'Matching voice with visuals' },
    { id: 'render', label: 'Rendering Final Video', status: 'pending', description: 'Creating your professional video' },
    { id: 'quality', label: 'Quality Check', status: 'pending', description: 'Ensuring perfect output' }
  ]);

  const loadingMessages = [
    "Generating professional AI voiceover...",
    "Creating stunning visual transitions...",
    "Synchronizing audio with property images...",
    "Rendering your high-quality video...",
    "Performing final quality checks...",
    "Your video is almost ready!"
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
      if (job.status === 'completed') {
        toast({
          title: "Success",
          description: "Your video has been generated successfully!"
        });
        navigate(`/job/${identifier}/result`);
      } else if (job.status === 'failed') {
        toast({
          title: "Error",
          description: errorDetails || "There was an issue generating the video.",
          variant: "destructive"
        });
        navigate(`/job/${identifier}/result`);
      }
    },
    onError: (error) => {
      console.error('Real-time error:', error);
      toast({
        title: "Error",
        description: "Connection error. Redirecting to result page.",
        variant: "destructive"
      });
      navigate(`/job/${identifier}/result`);
    }
  });

  const updateStepsBasedOnJob = (job: any) => {
    setSteps(prevSteps => {
      const newSteps = [...prevSteps];
      
      // Update steps based on progress percentage
      const progressSteps = Math.floor(progress / 20); // Each step represents ~20% progress
      
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
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
        <LoadingSpinner type="beat" size={12} color="#10B981" className="mb-4" />
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Video Generation Error</h2>
          <p className="text-gray-600">{errorDetails || "An error occurred while generating the video."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100">
      <Navigation />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <LoadingSpinner type="beat" size={12} color="#10B981" className="mb-4" />
              <h1 className="text-2xl font-bold text-gray-900">
                Creating Your Video
              </h1>
              <p className="text-gray-600">
                {detailedStatus}
              </p>
            </div>

            {/* Progress */}
            <div className="space-y-4">
              <ProgressBar 
                progress={progress} 
                label="Video Generation Progress"
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
              interval={4000}
              className="pt-4 border-t"
            />

            {/* Additional info for long process */}
            <div className="bg-emerald-50 rounded-lg p-4 text-sm text-emerald-700">
              <div className="font-medium mb-1">🎬 Creating Professional Quality</div>
              <div>This process ensures your video meets the highest standards with crisp audio and smooth transitions.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoGenerationLoading;
