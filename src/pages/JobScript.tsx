
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumb } from '@/components/Breadcrumb';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { Video, FileText, Mic } from 'lucide-react';
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
      setScript(data);
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
      const { error } = await supabase
        .from('video_scripts')
        .update({
          script_text: script.script_text,
          language: script.language,
          accent: script.accent,
          voice_id: script.voice_id
        })
        .eq('job_id', jobId);

      if (error) throw error;
      toast({ title: "Success", description: "Script saved successfully" });
    } catch (error) {
      console.error('Error saving script:', error);
      toast({ title: "Error", description: "Failed to save script", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const approveAndGenerate = async () => {
    try {
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'New Project', href: '/new-job' },
          { label: 'Review Data', href: `/job/${jobId}/review` },
          { label: 'Script & Voice' }
        ]} />

        <ProgressIndicator currentStep={3} totalSteps={4} stepLabel="Review Script & Select Voice" />

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Video Script
              </CardTitle>
              <CardDescription>Review and edit the generated script for your video</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={script.script_text || ''}
                onChange={(e) => updateScript('script_text', e.target.value)}
                rows={10}
                className="w-full"
                placeholder="Enter your video script here..."
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mic className="h-5 w-5 mr-2" />
                Voice Settings
              </CardTitle>
              <CardDescription>Choose the voice characteristics for your video narration</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Language</label>
                <Select 
                  value={script.language || 'English'} 
                  onValueChange={(value) => updateScript('language', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Spanish">Spanish</SelectItem>
                    <SelectItem value="French">French</SelectItem>
                    <SelectItem value="German">German</SelectItem>
                    <SelectItem value="Italian">Italian</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Accent</label>
                <Select 
                  value={script.accent || 'US'} 
                  onValueChange={(value) => updateScript('accent', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select accent" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="US">US</SelectItem>
                    <SelectItem value="UK">UK</SelectItem>
                    <SelectItem value="Australian">Australian</SelectItem>
                    <SelectItem value="Canadian">Canadian</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Voice</label>
                <Select 
                  value={script.voice_id || 'female-1'} 
                  onValueChange={(value) => updateScript('voice_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select voice" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="female-1">Female - Professional</SelectItem>
                    <SelectItem value="female-2">Female - Warm</SelectItem>
                    <SelectItem value="male-1">Male - Professional</SelectItem>
                    <SelectItem value="male-2">Male - Friendly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button variant="outline" onClick={saveScript} disabled={saving}>
              {saving ? 'Saving...' : 'Save Script'}
            </Button>
            <Button onClick={approveAndGenerate} className="flex-1">
              Approve & Generate Video
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JobScript;
