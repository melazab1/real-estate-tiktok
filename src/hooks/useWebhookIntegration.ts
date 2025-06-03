
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { WebhookService } from '@/services/webhookService';
import { useAuth } from '@/hooks/useAuth';
import type { Property } from '@/types/job';

export const useWebhookIntegration = (displayId: string | undefined) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const generateScript = async (property: Property | null) => {
    if (!user || !property || !displayId) return;

    try {
      // Update job status first
      await supabase
        .from('jobs')
        .update({ status: 'generating_script', current_step: 3 })
        .eq('display_id', displayId);

      // Navigate to loading page immediately
      navigate(`/job/${displayId}/script-generation-loading`);

      console.log('Calling script generation webhook with property data:', property);

      // Call script generation webhook
      const webhookResult = await WebhookService.callScriptGeneration(displayId, property, user.id);
      
      if (!webhookResult.success) {
        console.error('Script generation webhook failed:', webhookResult.error);
        
        // Fallback: create a default script
        await supabase
          .from('video_scripts')
          .insert({
            display_id: displayId,
            script_text: `Welcome to this stunning ${property?.bedrooms}-bedroom, ${property?.bathrooms}-bathroom home located in ${property?.location}. This beautiful property offers ${property?.area} square feet of living space, perfect for families looking for comfort and style. With its modern amenities and prime location, this home is truly a gem in today's market.`,
            language: 'English',
            accent: 'US',
            is_approved: false
          });

        toast({ 
          title: "Script Generated with Default Content", 
          description: "Webhook failed, but a default script was created. You can edit it on the next page.", 
          variant: "destructive" 
        });
      } else {
        console.log('Script generation webhook completed successfully');
      }

      // Update job status to script ready
      await supabase
        .from('jobs')
        .update({ status: 'script_ready', current_step: 3 })
        .eq('display_id', displayId);

    } catch (error) {
      console.error('Error generating script:', error);
      toast({ title: "Error", description: "Failed to generate script", variant: "destructive" });
    }
  };

  return {
    generateScript
  };
};
