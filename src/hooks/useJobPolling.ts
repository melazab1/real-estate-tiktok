
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Job } from '@/types/job';

interface UseJobPollingOptions {
  displayId: string;
  expectedStatus?: string;
  onStatusChange?: (job: Job) => void;
  onComplete?: (job: Job) => void;
  onError?: (error: Error) => void;
  maxDuration?: number; // in milliseconds
  baseInterval?: number; // base polling interval in milliseconds
}

export const useJobPolling = ({
  displayId,
  expectedStatus,
  onStatusChange,
  onComplete,
  onError,
  maxDuration = 5 * 60 * 1000, // 5 minutes default
  baseInterval = 2000 // 2 seconds default
}: UseJobPollingOptions) => {
  const [job, setJob] = useState<Job | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const pollCountRef = useRef(0);

  const calculateProgress = (elapsedTime: number, status: string): number => {
    // Estimate progress based on status and elapsed time
    const statusProgress = {
      'analyzing': 20,
      'reviewing': 40,
      'script_ready': 60,
      'generating_script': 70,
      'generating_video': 85,
      'completed': 100
    };

    const baseProgress = statusProgress[status as keyof typeof statusProgress] || 0;
    
    // Add time-based progress within each status
    const timeProgress = Math.min((elapsedTime / maxDuration) * 100, 100);
    
    return Math.max(baseProgress, Math.min(baseProgress + 20, timeProgress));
  };

  const calculateEstimatedTime = (elapsedTime: number, currentProgress: number): number | null => {
    if (currentProgress <= 0) return null;
    
    const totalEstimatedTime = (elapsedTime / currentProgress) * 100;
    return Math.max(0, totalEstimatedTime - elapsedTime);
  };

  const getDynamicInterval = (pollCount: number): number => {
    // Exponential backoff with max interval of 10 seconds
    return Math.min(baseInterval * Math.pow(1.2, pollCount / 5), 10000);
  };

  const pollJob = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('display_id', displayId)
        .single();

      if (error) throw error;

      if (data) {
        setJob(data);
        
        const elapsedTime = Date.now() - startTimeRef.current;
        const currentProgress = calculateProgress(elapsedTime, data.status || '');
        const estimatedTime = calculateEstimatedTime(elapsedTime, currentProgress);
        
        setProgress(currentProgress);
        setEstimatedTimeRemaining(estimatedTime);
        
        onStatusChange?.(data);

        // Check if we've reached the expected status or completed
        if (expectedStatus && data.status === expectedStatus) {
          onComplete?.(data);
          stopPolling();
        } else if (data.status === 'completed' || data.status === 'failed') {
          onComplete?.(data);
          stopPolling();
        }
      }
    } catch (error) {
      console.error('Error polling job:', error);
      onError?.(error as Error);
    }
  };

  const startPolling = () => {
    if (isPolling) return;
    
    setIsPolling(true);
    startTimeRef.current = Date.now();
    pollCountRef.current = 0;
    
    // Initial poll
    pollJob();
    
    const scheduleNextPoll = () => {
      if (!isPolling) return;
      
      pollCountRef.current++;
      const interval = getDynamicInterval(pollCountRef.current);
      
      intervalRef.current = setTimeout(() => {
        if (Date.now() - startTimeRef.current > maxDuration) {
          onError?.(new Error('Polling timeout exceeded'));
          stopPolling();
          return;
        }
        
        pollJob();
        scheduleNextPoll();
      }, interval);
    };
    
    scheduleNextPoll();
  };

  const stopPolling = () => {
    setIsPolling(false);
    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, []);

  return {
    job,
    isPolling,
    progress,
    estimatedTimeRemaining,
    startPolling,
    stopPolling
  };
};
