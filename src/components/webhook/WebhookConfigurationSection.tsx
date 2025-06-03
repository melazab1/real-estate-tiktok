
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { WebhookCard } from './WebhookCard';

interface WebhookSettings {
  id?: string;
  property_extraction_url: string | null;
  script_generation_url: string | null;
  video_generation_url: string | null;
}

interface WebhookConfigurationSectionProps {
  settings: WebhookSettings;
  saving: boolean;
  onSave: () => void;
  onUpdateSetting: (field: keyof WebhookSettings, value: string) => void;
}

export const WebhookConfigurationSection = ({
  settings,
  saving,
  onSave,
  onUpdateSetting
}: WebhookConfigurationSectionProps) => {
  return (
    <div className="space-y-6">
      <WebhookCard
        title="Property Extraction Webhook"
        description="Called immediately when a URL is submitted. If not configured, falls back to built-in Edge Function."
        url={settings.property_extraction_url || ''}
        onUrlChange={(value) => onUpdateSetting('property_extraction_url', value)}
        fieldId="property_extraction_url"
        placeholder="https://your-api.com/webhooks/property-extraction"
        receivesData="job_id, property_url, user_id, timestamp"
      />

      <WebhookCard
        title="Script Generation Webhook"
        description='Called when user clicks "Generate Script" after reviewing property data.'
        url={settings.script_generation_url || ''}
        onUrlChange={(value) => onUpdateSetting('script_generation_url', value)}
        fieldId="script_generation_url"
        placeholder="https://your-api.com/webhooks/script-generation"
        receivesData="job_id, property_data, user_id, timestamp"
      />

      <WebhookCard
        title="Video Generation Webhook"
        description="Called when user approves script and starts video generation."
        url={settings.video_generation_url || ''}
        onUrlChange={(value) => onUpdateSetting('video_generation_url', value)}
        fieldId="video_generation_url"
        placeholder="https://your-api.com/webhooks/video-generation"
        receivesData="job_id, script_data, user_id, timestamp"
      />

      <div className="flex justify-end">
        <Button onClick={onSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
};
