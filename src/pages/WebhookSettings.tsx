
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Video, Save, Settings, ExternalLink } from 'lucide-react';
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
            Configure webhook URLs for external integrations
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Property Extraction Webhook</CardTitle>
              <CardDescription>
                URL to call when a property listing needs to be extracted and analyzed
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
                This webhook will receive job details and property URL for processing.
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Script Generation Webhook</CardTitle>
              <CardDescription>
                URL to call when a video script needs to be generated
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
                This webhook will receive property data and generate a video script.
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Video Generation Webhook</CardTitle>
              <CardDescription>
                URL to call when the final video needs to be generated
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
                This webhook will receive script and property data to generate the final video.
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Webhook Documentation</CardTitle>
              <CardDescription>
                Learn more about implementing webhooks for your VideoGen integration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">API Documentation</div>
                    <div className="text-sm text-gray-500">
                      Complete webhook payload schemas and examples
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Docs
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">Example Implementation</div>
                    <div className="text-sm text-gray-500">
                      Sample webhook handlers in various languages
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Examples
                  </Button>
                </div>
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
