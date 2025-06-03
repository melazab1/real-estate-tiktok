
import { supabase } from '@/integrations/supabase/client';
import type { VideoScript } from '@/types/job';

export class ScriptService {
  static async fetchScript(jobId: string): Promise<VideoScript | null> {
    const { data, error } = await supabase
      .from('video_scripts')
      .select('*')
      .eq('job_id', jobId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    
    // Return default values if script doesn't exist
    if (!data) {
      return {
        id: '',
        job_id: jobId,
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
  }

  static async saveScript(jobId: string, script: VideoScript, isNew: boolean): Promise<void> {
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
          job_id: jobId,
          ...scriptData
        });
      if (error) throw error;
    } else {
      // Update existing script
      const { error } = await supabase
        .from('video_scripts')
        .update(scriptData)
        .eq('job_id', jobId);
      if (error) throw error;
    }
  }

  static async approveScript(jobId: string): Promise<void> {
    await supabase
      .from('video_scripts')
      .update({ is_approved: true })
      .eq('job_id', jobId);
  }

  static async updateJobStatus(jobId: string, status: string, currentStep: number): Promise<void> {
    await supabase
      .from('jobs')
      .update({ status, current_step: currentStep })
      .eq('job_id', jobId);
  }

  static async createVideoRecord(jobId: string): Promise<void> {
    await supabase
      .from('videos')
      .insert({
        job_id: jobId,
        status: 'processing'
      });
  }
}
