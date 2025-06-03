
import { JobService } from '@/services/jobService';

/**
 * Resolves a job identifier (display ID or UUID) to a job record
 * This utility handles both the new display IDs and legacy UUID-based routing
 */
export const resolveJobIdentifier = async (identifier: string) => {
  // First try to find by display_id (new format)
  let job = await JobService.getJobByDisplayId(identifier);
  
  // If not found and identifier looks like a UUID, try job_id (legacy support)
  if (!job && isUUID(identifier)) {
    job = await JobService.getJobByJobId(identifier);
  }
  
  return job;
};

/**
 * Simple UUID format validation
 */
const isUUID = (str: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

/**
 * Gets the preferred identifier for a job (display_id if available, otherwise job_id)
 */
export const getJobIdentifier = (job: { display_id?: string | null; job_id: string }): string => {
  return job.display_id || job.job_id;
};
