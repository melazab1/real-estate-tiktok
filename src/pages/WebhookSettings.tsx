
import { useAuth } from '@/hooks/useAuth';
import { WebhookHeader } from '@/components/webhook/WebhookHeader';
import { WebhookPageTitle } from '@/components/webhook/WebhookPageTitle';
import { SystemStatusCard } from '@/components/webhook/SystemStatusCard';
import { WebhookConfigurationSection } from '@/components/webhook/WebhookConfigurationSection';
import { useWebhookSettings } from '@/hooks/useWebhookSettings';

export const WebhookSettings = () => {
  const { signOut } = useAuth();
  const {
    settings,
    loading,
    saving,
    handleSave,
    updateSetting
  } = useWebhookSettings();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <WebhookHeader onSignOut={signOut} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <WebhookPageTitle />
        <SystemStatusCard />
        <WebhookConfigurationSection
          settings={settings}
          saving={saving}
          onSave={handleSave}
          onUpdateSetting={updateSetting}
        />
      </main>
    </div>
  );
};

export default WebhookSettings;
