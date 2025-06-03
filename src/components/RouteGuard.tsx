
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Job } from '@/types/job';

interface RouteGuardProps {
  job: Job | null;
  currentStep: 'review' | 'script' | 'result';
  children: React.ReactNode;
}

export const RouteGuard = ({ job, currentStep, children }: RouteGuardProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!job) return;

    const status = job.status;
    
    // Allow script editing even for completed videos
    if (currentStep === 'script') {
      return;
    }

    // Route protection logic
    if (status === 'completed') {
      // For completed videos, only allow result viewing
      if (currentStep !== 'result') {
        navigate(`/job/${job.job_id}/result`);
        return;
      }
    } else if (status === 'script_ready') {
      // For script ready, only allow script or result
      if (currentStep === 'review') {
        navigate(`/job/${job.job_id}/script`);
        return;
      }
    } else if (status === 'reviewing' || status === 'analyzing') {
      // For reviewing/analyzing, only allow review
      if (currentStep !== 'review') {
        navigate(`/job/${job.job_id}/review`);
        return;
      }
    }
  }, [job, currentStep, navigate]);

  return <>{children}</>;
};
