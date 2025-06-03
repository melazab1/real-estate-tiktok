
import { supabase } from '@/integrations/supabase/client';

export class JobService {
  static async createJob(jobId: string, userId: string, propertyUrl: string): Promise<void> {
    const { error } = await supabase
      .from('jobs')
      .insert({
        job_id: jobId,
        user_id: userId,
        property_url: propertyUrl,
        status: 'analyzing',
        current_step: 1
      });

    if (error) {
      console.error('Error creating job:', error);
      throw error;
    }
  }

  static generateJobId(): string {
    return crypto.randomUUID();
  }
}
