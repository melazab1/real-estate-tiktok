
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface WebhookSettings {
  id?: string;
  property_extraction_url: string | null;
  script_generation_url: string | null;
  video_generation_url: string | null;
}

export const useWebhookSettings = () => {
  const { user } = useAuth();
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

  return {
    settings,
    loading,
    saving,
    handleSave,
    updateSetting
  };
};
