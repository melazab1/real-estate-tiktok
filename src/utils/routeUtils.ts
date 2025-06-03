
import { JobService } from '@/services/jobService';

/**
 * Resolves a job identifier to a job record
 * Since we now only use display_id, this just calls getJobByDisplayId
 */
export const resolveJobIdentifier = async (identifier: string) => {
  return await JobService.getJobByDisplayId(identifier);
};

/**
 * Gets the preferred identifier for a job (always display_id now)
 */
export const getJobIdentifier = (job: { display_id: string }): string => {
  return job.display_id;
};
