
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Video, Save, Settings, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface WebhookSettings {
  id?: string;
  property_extraction_url: string | null;
  script_generation_url: string | null;
  video_generation_url: string | null;
}

export const WebhookSettings = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState<WebhookSettings>({
    property_extraction_url: '',
    script_generation_url: '',
    video_generation_url: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchSettings();
    }
  }, [user]);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('webhook_settings')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching webhook settings:', error);
        toast({
          title: "Error",
          description: "Failed to load webhook settings",
          variant: "destructive",
        });
      } else if (data) {
        setSettings({
          id: data.id,
          property_extraction_url: data.property_extraction_url || '',
          script_generation_url: data.script_generation_url || '',
          video_generation_url: data.video_generation_url || ''
        });
      }
    } catch (error) {
      console.error('Error fetching webhook settings:', error);
      toast({
        title: "Error",
        description: "Failed to load webhook settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const webhookData = {
        user_id: user?.id,
        property_extraction_url: settings.property_extraction_url || null,
        script_generation_url: settings.script_generation_url || null,
        video_generation_url: settings.video_generation_url || null
      };

      if (settings.id) {
        // Update existing settings
        const { error } = await supabase
          .from('webhook_settings')
          .update(webhookData)
          .eq('id', settings.id);

        if (error) throw error;
      } else {
        // Create new settings
        const { data, error } = await supabase
          .from('webhook_settings')
          .insert(webhookData)
          .select()
          .single();

        if (error) throw error;
        setSettings(prev => ({ ...prev, id: data.id }));
      }

      toast({
        title: "Success",
        description: "Webhook settings saved successfully",
      });
    } catch (error) {
      console.error('Error saving webhook settings:', error);
      toast({
        title: "Error",
        description: "Failed to save webhook settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (field: keyof WebhookSettings, value: string) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Video className="h-8 w-8 text-blue-600 mr-2" />
              <span className="text-xl font-bold">VideoGen</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <Button variant="outline" size="sm" onClick={signOut}>
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Settings className="h-8 w-8 mr-3" />
            Webhook Settings
          </h1>
          <p className="text-gray-600 mt-2">
            Configure webhook URLs for external integrations. Webhooks are called directly from the frontend with immediate fallback to Edge Functions.
          </p>
        </div>

        {/* System Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              System Status: Direct Webhook Integration
            </CardTitle>
            <CardDescription>
              Your VideoGen system now uses direct webhook calls for better reliability and user feedback.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Direct Frontend Calls</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm">Edge Function Fallback</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm">Real-time Error Handling</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                Property Extraction Webhook
                {settings.property_extraction_url ? (
                  <CheckCircle className="h-4 w-4 text-green-600 ml-2" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-orange-500 ml-2" />
                )}
              </CardTitle>
              <CardDescription>
                Called immediately when a URL is submitted. If not configured, falls back to built-in Edge Function.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="property_extraction_url">Webhook URL</Label>
                <Input
                  id="property_extraction_url"
                  type="url"
                  placeholder="https://your-api.com/webhooks/property-extraction"
                  value={settings.property_extraction_url || ''}
                  onChange={(e) => updateSetting('property_extraction_url', e.target.value)}
                />
              </div>
              <div className="text-sm text-gray-500">
                Receives: job_id, property_url, user_id, timestamp
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                Script Generation Webhook
                {settings.script_generation_url ? (
                  <CheckCircle className="h-4 w-4 text-green-600 ml-2" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-orange-500 ml-2" />
                )}
              </CardTitle>
              <CardDescription>
                Called when user clicks "Generate Script" after reviewing property data.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="script_generation_url">Webhook URL</Label>
                <Input
                  id="script_generation_url"
                  type="url"
                  placeholder="https://your-api.com/webhooks/script-generation"
                  value={settings.script_generation_url || ''}
                  onChange={(e) => updateSetting('script_generation_url', e.target.value)}
                />
              </div>
              <div className="text-sm text-gray-500">
                Receives: job_id, property_data, user_id, timestamp
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                Video Generation Webhook
                {settings.video_generation_url ? (
                  <CheckCircle className="h-4 w-4 text-green-600 ml-2" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-orange-500 ml-2" />
                )}
              </CardTitle>
              <CardDescription>
                Called when user approves script and starts video generation.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="video_generation_url">Webhook URL</Label>
                <Input
                  id="video_generation_url"
                  type="url"
                  placeholder="https://your-api.com/webhooks/video-generation"
                  value={settings.video_generation_url || ''}
                  onChange={(e) => updateSetting('video_generation_url', e.target.value)}
                />
              </div>
              <div className="text-sm text-gray-500">
                Receives: job_id, script_data, user_id, timestamp
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WebhookSettings;
