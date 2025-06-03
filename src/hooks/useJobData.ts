
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { resolveJobIdentifier } from '@/utils/routeUtils';
import { Job } from '@/types/job';

export const useJobData = () => {
  const { identifier } = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJob = async () => {
      if (!identifier) {
        setError('No job identifier provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const jobData = await resolveJobIdentifier(identifier);
        
        if (!jobData) {
          setError('Job not found');
        } else {
          setJob(jobData);
        }
      } catch (err) {
        console.error('Error fetching job:', err);
        setError('Failed to fetch job data');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [identifier]);

  return { job, loading, error };
};
