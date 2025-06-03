
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { VideoScript } from '@/types/job';

export const useJobScript = (jobId: string | undefined) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [script, setScript] = useState<VideoScript | null>(null);

  useEffect(() => {
    if (jobId) {
      fetchScript();
    }
  }, [jobId]);

  const fetchScript = async () => {
    try {
      const { data, error } = await supabase
        .from('video_scripts')
        .select('*')
        .eq('job_id', jobId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      // Set default values if script doesn't exist
      if (!data) {
        setScript({
          id: '',
          job_id: jobId!,
          script_text: '',
          language: 'English',
          accent: 'US',
          voice_id: 'en-us-female-1',
          is_approved: false,
          created_at: null,
          updated_at: null
        });
      } else {
        setScript(data);
      }
    } catch (error) {
      console.error('Error fetching script:', error);
      toast({ title: "Error", description: "Failed to load script", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const updateScript = (field: keyof VideoScript, value: any) => {
    if (!script) return;
    setScript({ ...script, [field]: value });
  };

  const saveScript = async () => {
    if (!script) return;
    
    setSaving(true);
    try {
      const scriptData = {
        script_text: script.script_text,
        language: script.language,
        accent: script.accent,
        voice_id: script.voice_id
      };

      if (script.id) {
        // Update existing script
        const { error } = await supabase
          .from('video_scripts')
          .update(scriptData)
          .eq('job_id', jobId);
        if (error) throw error;
      } else {
        // Create new script
        const { error } = await supabase
          .from('video_scripts')
          .insert({
            job_id: jobId!,
            ...scriptData
          });
        if (error) throw error;
      }

      toast({ title: "Success", description: "Script saved successfully" });
      await fetchScript(); // Refresh to get the latest data
    } catch (error) {
      console.error('Error saving script:', error);
      toast({ title: "Error", description: "Failed to save script", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const approveAndGenerate = async () => {
    if (!script?.script_text?.trim()) {
      toast({ title: "Error", description: "Please add a script before generating video", variant: "destructive" });
      return;
    }

    try {
      // Save current script first
      await saveScript();

      // Approve script and start generation
      await supabase
        .from('video_scripts')
        .update({ is_approved: true })
        .eq('job_id', jobId);

      await supabase
        .from('jobs')
        .update({ status: 'generating', current_step: 4 })
        .eq('job_id', jobId);

      // Create video record
      await supabase
        .from('videos')
        .insert({
          job_id: jobId!,
          status: 'processing'
        });

      toast({ title: "Success", description: "Video generation started" });
      navigate(`/job/${jobId}/result`);
    } catch (error) {
      console.error('Error starting video generation:', error);
      toast({ title: "Error", description: "Failed to start video generation", variant: "destructive" });
    }
  };

  return {
    loading,
    saving,
    script,
    updateScript,
    saveScript,
    approveAndGenerate
  };
};
