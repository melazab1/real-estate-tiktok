
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

const VideoGenerationLoading = () => {
  const { jobId } = useParams<{ jobId: string }>();
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

  const { job, progress, estimatedTimeRemaining, startPolling } = useJobPolling({
    jobId: jobId!,
    expectedStatus: 'completed',
    onStatusChange: (job) => {
      updateStepsBasedOnJob(job);
    },
    onComplete: (job) => {
      toast({
        title: "Success",
        description: "Your video has been generated successfully!"
      });
      navigate(`/job/${jobId}/result`);
    },
    onError: (error) => {
      console.error('Polling error:', error);
      toast({
        title: "Error",
        description: "There was an issue generating the video. Redirecting to result page.",
        variant: "destructive"
      });
      navigate(`/job/${jobId}/result`);
    },
    maxDuration: 8 * 60 * 1000, // 8 minutes for video generation
    baseInterval: 3000 // Poll every 3 seconds for video generation
  });

  const updateStepsBasedOnJob = (job: any) => {
    setSteps(prevSteps => {
      const newSteps = [...prevSteps];
      
      if (job.status === 'generating_video') {
        // Simulate progress through video generation steps
        const elapsedTime = Date.now() - Date.now(); // This would be actual elapsed time
        const progressSteps = Math.floor(progress / 20); // Each step represents ~20% progress
        
        newSteps.forEach((step, index) => {
          if (index < progressSteps) {
            step.status = 'completed';
          } else if (index === progressSteps) {
            step.status = 'active';
          }
        });
      } else if (job.status === 'completed') {
        newSteps.forEach(step => step.status = 'completed');
      }
      
      return newSteps;
    });
  };

  useEffect(() => {
    if (jobId) {
      startPolling();
    }
  }, [jobId]);

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
                We're generating a professional property video with AI voiceover and stunning visuals.
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
                timeRemaining={estimatedTimeRemaining}
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
