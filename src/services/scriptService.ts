
import { supabase } from '@/integrations/supabase/client';
import type { VideoScript } from '@/types/job';

export class ScriptService {
  static async getJobByDisplayId(displayId: string) {
    const { data: jobData, error: jobError } = await supabase
      .from('jobs')
      .select('id')
      .eq('display_id', displayId)
      .single();

    if (jobError) throw jobError;
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

      if (error && error.code !== 'PGRST116') throw error;
      
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
      const jobData = await this.getJobByDisplayId(displayId);

      const scriptData = {
        script_text: script.script_text,
        language: script.language,
        accent: script.accent,
        voice_id: script.voice_id
      };

      if (isNew) {
        // Create new script
        const { error } = await supabase
          .from('video_scripts')
          .insert({
            job_id: jobData.id,
            ...scriptData
          });
        if (error) throw error;
      } else {
        // Update existing script - use job_id for reliable updates
        const { error } = await supabase
          .from('video_scripts')
          .update(scriptData)
          .eq('job_id', jobData.id);
        if (error) throw error;
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
      
      if (error) throw error;
    } catch (error) {
      console.error('Error approving script:', error);
      throw error;
    }
  }

  static async updateJobStatus(displayId: string, status: string, currentStep: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ status, current_step: currentStep })
        .eq('display_id', displayId);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error updating job status:', error);
      throw error;
    }
  }

  static async createVideoRecord(displayId: string): Promise<void> {
    try {
      const jobData = await this.getJobByDisplayId(displayId);

      const { error } = await supabase
        .from('videos')
        .insert({
          job_id: jobData.id,
          status: 'processing'
        });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error creating video record:', error);
      throw error;
    }
  }
}
