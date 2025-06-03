
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
        current_step: 1
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
}
