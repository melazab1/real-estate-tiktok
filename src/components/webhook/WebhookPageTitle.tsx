
import { Settings } from 'lucide-react';

export const WebhookPageTitle = () => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900 flex items-center">
        <Settings className="h-8 w-8 mr-3" />
        Webhook Settings
      </h1>
      <p className="text-gray-600 mt-2">
        Configure webhook URLs for external integrations. Webhooks are called directly from the frontend with immediate fallback to Edge Functions.
      </p>
    </div>
  );
};
