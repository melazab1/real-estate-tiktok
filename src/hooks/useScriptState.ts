
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { ScriptService } from '@/services/scriptService';
import type { VideoScript } from '@/types/job';

export const useScriptState = (jobId: string | undefined) => {
  const [loading, setLoading] = useState(true);
  const [script, setScript] = useState<VideoScript | null>(null);

  useEffect(() => {
    if (jobId) {
      fetchScript();
    }
  }, [jobId]);

  const fetchScript = async () => {
    try {
      const scriptData = await ScriptService.fetchScript(jobId!);
      setScript(scriptData);
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

  return {
    loading,
    script,
    updateScript,
    refetchScript: fetchScript
  };
};
