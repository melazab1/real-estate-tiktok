
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { WebhookService } from '@/services/webhookService';
import { ScriptService } from '@/services/scriptService';
import { useAuth } from '@/hooks/useAuth';
import type { VideoScript } from '@/types/job';

export const useScriptActions = (jobId: string | undefined, script: VideoScript | null) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);

  const saveScript = async (refetchScript: () => Promise<void>) => {
    if (!script || !jobId) return;
    
    setSaving(true);
    try {
      const isNew = !script.id;
      await ScriptService.saveScript(jobId, script, isNew);
      
      toast({ title: "Success", description: "Script saved successfully" });
      await refetchScript(); // Refresh to get the latest data
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

    if (!user || !jobId) return;

    try {
      // Save current script first
      const isNew = !script.id;
      await ScriptService.saveScript(jobId, script, isNew);

      // Approve script
      await ScriptService.approveScript(jobId);

      // Update job status
      await ScriptService.updateJobStatus(jobId, 'generating_video', 4);

      // Create video record
      await ScriptService.createVideoRecord(jobId);

      console.log('Calling video generation webhook with script data:', script);

      // Call video generation webhook
      const webhookResult = await WebhookService.callVideoGeneration(jobId, script, user.id);
      
      if (!webhookResult.success) {
        console.error('Video generation webhook failed:', webhookResult.error);
        toast({ 
          title: "Video Generation Started with Warning", 
          description: "Video generation started but there was an issue with the webhook. Check the result page for updates.", 
          variant: "destructive" 
        });
      } else {
        console.log('Video generation webhook completed successfully');
        toast({ title: "Success", description: "Video generation started successfully!" });
      }

      navigate(`/job/${jobId}/result`);
    } catch (error) {
      console.error('Error starting video generation:', error);
      toast({ title: "Error", description: "Failed to start video generation", variant: "destructive" });
    }
  };

  return {
    saving,
    saveScript,
    approveAndGenerate
  };
};
