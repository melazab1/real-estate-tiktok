
import { supabase } from '@/integrations/supabase/client';
import type { VideoScript } from '@/types/job';

export class ScriptService {
  static async getJobByDisplayId(displayId: string) {
    if (!displayId) {
      throw new Error('Display ID is required');
    }

    const { data: jobData, error: jobError } = await supabase
      .from('jobs')
      .select('id')
      .eq('display_id', displayId)
      .single();

    if (jobError) {
      console.error('Error fetching job by display ID:', jobError);
      if (jobError.code === 'PGRST116') {
        throw new Error(`Job with display ID "${displayId}" not found`);
      }
      throw new Error(`Database error: ${jobError.message}`);
    }

    if (!jobData) {
      throw new Error(`Job with display ID "${displayId}" not found`);
    }

    return jobData;
  }

  static async fetchScript(displayId: string): Promise<VideoScript | null> {
    try {
      const jobData = await this.getJobByDisplayId(displayId);

      const { data, error } = await supabase
        .from('video_scripts')
        .select('*')
        .eq('job_id', jobData.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching script:', error);
        throw new Error(`Failed to fetch script: ${error.message}`);
      }
      
      // Return default values if script doesn't exist
      if (!data) {
        return {
          id: '',
          job_id: jobData.id,
          script_text: '',
          language: 'English',
          accent: 'US',
          voice_id: 'en-us-female-1',
          is_approved: false,
          created_at: null,
          updated_at: null
        };
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching script:', error);
      throw error;
    }
  }

  static async saveScript(displayId: string, script: VideoScript, isNew: boolean): Promise<void> {
    try {
      if (!script.script_text?.trim()) {
        throw new Error('Script text is required');
      }

      const jobData = await this.getJobByDisplayId(displayId);

      const scriptData = {
        script_text: script.script_text.trim(),
        language: script.language || 'English',
        accent: script.accent || 'US',
        voice_id: script.voice_id || 'en-us-female-1'
      };

      if (isNew) {
        // Create new script
        const { error } = await supabase
          .from('video_scripts')
          .insert({
            job_id: jobData.id,
            ...scriptData
          });
        
        if (error) {
          console.error('Error creating script:', error);
          throw new Error(`Failed to create script: ${error.message}`);
        }
        
        console.log('Script created successfully');
      } else {
        // Update existing script - use job_id for reliable updates
        const { error } = await supabase
          .from('video_scripts')
          .update(scriptData)
          .eq('job_id', jobData.id);
        
        if (error) {
          console.error('Error updating script:', error);
          throw new Error(`Failed to update script: ${error.message}`);
        }
        
        console.log('Script updated successfully');
      }
    } catch (error) {
      console.error('Error saving script:', error);
      throw error;
    }
  }

  static async approveScript(displayId: string): Promise<void> {
    try {
      const jobData = await this.getJobByDisplayId(displayId);

      const { error } = await supabase
        .from('video_scripts')
        .update({ is_approved: true })
        .eq('job_id', jobData.id);
      
      if (error) {
        console.error('Error approving script:', error);
        throw new Error(`Failed to approve script: ${error.message}`);
      }
      
      console.log('Script approved successfully');
    } catch (error) {
      console.error('Error approving script:', error);
      throw error;
    }
  }

  static async updateJobStatus(displayId: string, status: string, currentStep: number): Promise<void> {
    try {
      if (!status || currentStep < 1) {
        throw new Error('Valid status and current step are required');
      }

      const { error } = await supabase
        .from('jobs')
        .update({ 
          status, 
          current_step: currentStep,
          last_updated_at: new Date().toISOString()
        })
        .eq('display_id', displayId);
      
      if (error) {
        console.error('Error updating job status:', error);
        throw new Error(`Failed to update job status: ${error.message}`);
      }
      
      console.log(`Job status updated to ${status}, step ${currentStep}`);
    } catch (error) {
      console.error('Error updating job status:', error);
      throw error;
    }
  }

  static async createVideoRecord(displayId: string): Promise<void> {
    try {
      const jobData = await this.getJobByDisplayId(displayId);

      // Check if video record already exists
      const { data: existingVideo } = await supabase
        .from('videos')
        .select('id')
        .eq('job_id', jobData.id)
        .maybeSingle();

      if (existingVideo) {
        console.log('Video record already exists, skipping creation');
        return;
      }

      const { error } = await supabase
        .from('videos')
        .insert({
          job_id: jobData.id,
          status: 'processing'
        });
      
      if (error) {
        console.error('Error creating video record:', error);
        throw new Error(`Failed to create video record: ${error.message}`);
      }
      
      console.log('Video record created successfully');
    } catch (error) {
      console.error('Error creating video record:', error);
      throw error;
    }
  }
}
