
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Job } from '@/types/job';
import { getJobIdentifier } from '@/utils/routeUtils';

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
    const jobIdentifier = getJobIdentifier(job);
    
    // Allow script editing even for completed videos
    if (currentStep === 'script') {
      return;
    }

    // Route protection logic
    if (status === 'completed') {
      // For completed videos, only allow result viewing
      if (currentStep !== 'result') {
        navigate(`/job/${jobIdentifier}/result`);
        return;
      }
    } else if (status === 'script_ready') {
      // For script ready, only allow script or result
      if (currentStep === 'review') {
        navigate(`/job/${jobIdentifier}/script`);
        return;
      }
    } else if (status === 'reviewing' || status === 'analyzing') {
      // For reviewing/analyzing, only allow review
      if (currentStep !== 'review') {
        navigate(`/job/${jobIdentifier}/review`);
        return;
      }
    }
  }, [job, currentStep, navigate]);

  return <>{children}</>;
};
