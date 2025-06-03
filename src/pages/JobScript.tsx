
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Breadcrumb } from '@/components/Breadcrumb';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { ScriptEditor } from '@/components/ScriptEditor';
import { VoiceSelector } from '@/components/VoiceSelector';
import { Video } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import type { VideoScript } from '@/types/job';

const JobScript = () => {
  const { jobId } = useParams<{ jobId: string }>();
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!script) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Script Not Found</h2>
          <p className="text-gray-600">Please go back and generate a script first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Video className="h-8 w-8 text-blue-600 mr-2" />
              <span className="text-xl font-bold">VideoGen</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'New Project', href: '/new-job' },
          { label: 'Review Data', href: `/job/${jobId}/review` },
          { label: 'Script & Voice' }
        ]} />

        <ProgressIndicator currentStep={3} totalSteps={4} stepLabel="Review Script & Select Voice" />

        <div className="space-y-8">
          {/* Script Editor */}
          <ScriptEditor
            script={script.script_text || ''}
            onScriptChange={(newScript) => updateScript('script_text', newScript)}
            onSave={saveScript}
          />

          {/* Voice Selector */}
          <VoiceSelector
            selectedLanguage={script.language || 'English'}
            selectedAccent={script.accent || 'US'}
            selectedVoiceId={script.voice_id || 'en-us-female-1'}
            onLanguageChange={(language) => {
              updateScript('language', language);
              // Reset accent to US when changing to English, or clear it for other languages
              if (language === 'English') {
                updateScript('accent', 'US');
                updateScript('voice_id', 'en-us-female-1');
              } else {
                updateScript('accent', null);
                // Set first available voice for the new language
                const languageCode = language.toLowerCase().substring(0, 2);
                updateScript('voice_id', `${languageCode}-female-1`);
              }
            }}
            onAccentChange={(accent) => {
              updateScript('accent', accent);
              // Update voice to match new accent
              const accentCode = accent.toLowerCase() === 'uk' ? 'uk' : 
                                accent.toLowerCase() === 'australian' ? 'au' : 'us';
              updateScript('voice_id', `en-${accentCode}-female-1`);
            }}
            onVoiceChange={(voiceId) => updateScript('voice_id', voiceId)}
          />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              variant="outline" 
              onClick={saveScript} 
              disabled={saving}
              className="sm:w-auto"
            >
              {saving ? 'Saving...' : 'Save Script'}
            </Button>
            <Button 
              onClick={approveAndGenerate} 
              className="flex-1 sm:flex-none sm:px-8"
              disabled={!script.script_text?.trim()}
            >
              Approve & Generate Video
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JobScript;
