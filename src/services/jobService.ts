
import { supabase } from '@/integrations/supabase/client';

export class JobService {
  static async createJob(jobId: string, userId: string, propertyUrl: string): Promise<void> {
    console.log('Attempting to create job:', { jobId, userId, propertyUrl });
    
    const { error } = await supabase
      .from('jobs')
      .insert({
        job_id: jobId,
        user_id: userId,
        property_url: propertyUrl,
        status: 'analyzing',
        current_step: 1,
        display_id: '' // Temporary value - will be overridden by the database trigger
      });

    if (error) {
      console.error('Error creating job in database:', error);
      throw new Error(`Failed to create job: ${error.message}`);
    }
    
    console.log('Job created successfully in database');
  }

  static generateJobId(): string {
    return crypto.randomUUID();
  }

  static async getJobByDisplayId(displayId: string) {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('display_id', displayId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching job by display ID:', error);
      return null;
    }

    return data;
  }

  static async getJobByJobId(jobId: string) {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('job_id', jobId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching job by job ID:', error);
      return null;
    }

    return data;
  }
}
