
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Job } from '@/types/job';

interface UseJobRealtimeOptions {
  displayId: string;
  onStatusChange?: (job: Job) => void;
  onComplete?: (job: Job) => void;
  onError?: (error: Error) => void;
}

export const useJobRealtime = ({
  displayId,
  onStatusChange,
  onComplete,
  onError
}: UseJobRealtimeOptions) => {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initial fetch
    const fetchInitialJob = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error: fetchError } = await supabase
          .from('jobs')
          .select('*')
          .eq('display_id', displayId)
          .single();

        if (fetchError) {
          throw new Error(`Job not found: ${fetchError.message}`);
        }

        setJob(data);
        onStatusChange?.(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch job';
        setError(errorMessage);
        onError?.(new Error(errorMessage));
      } finally {
        setLoading(false);
      }
    };

    fetchInitialJob();

    // Set up real-time subscription
    const channel = supabase
      .channel('job-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'jobs',
          filter: `display_id=eq.${displayId}`
        },
        (payload) => {
          console.log('Real-time job update received:', payload);
          const updatedJob = payload.new as Job;
          
          setJob(updatedJob);
          onStatusChange?.(updatedJob);

          // Check if job is completed or failed
          if (updatedJob.status === 'completed' || updatedJob.status === 'failed') {
            onComplete?.(updatedJob);
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to job updates');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Error subscribing to job updates');
          onError?.(new Error('Failed to subscribe to real-time updates'));
        }
      });

    return () => {
      console.log('Cleaning up real-time subscription');
      supabase.removeChannel(channel);
    };
  }, [displayId, onStatusChange, onComplete, onError]);

  const getProgress = (): number => {
    return job?.progress_percentage || 0;
  };

  const getDetailedStatus = (): string => {
    return job?.detailed_status || 'Processing...';
  };

  const getEstimatedCompletion = (): Date | null => {
    return job?.estimated_completion ? new Date(job.estimated_completion) : null;
  };

  const hasError = (): boolean => {
    return job?.status === 'failed' || !!job?.error_details;
  };

  const getErrorDetails = (): string | null => {
    return job?.error_details || null;
  };

  return {
    job,
    loading,
    error,
    progress: getProgress(),
    detailedStatus: getDetailedStatus(),
    estimatedCompletion: getEstimatedCompletion(),
    hasError: hasError(),
    errorDetails: getErrorDetails()
  };
};
