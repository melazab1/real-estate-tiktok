
import { supabase } from '@/integrations/supabase/client';

export interface WebhookResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export class WebhookService {
  private static async getUserWebhookSettings(userId: string) {
    const { data, error } = await supabase
      .from('webhook_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching webhook settings:', error);
      return null;
    }

    return data;
  }

  static async callPropertyExtraction(jobId: string, propertyUrl: string, userId: string): Promise<WebhookResponse> {
    try {
      const settings = await this.getUserWebhookSettings(userId);
      
      if (!settings?.property_extraction_url) {
        console.log('No property extraction webhook configured, using Edge Function fallback');
        
        // Fallback to Edge Function
        const { data, error } = await supabase.functions.invoke('property-extraction', {
          body: {
            job_id: jobId,
            property_url: propertyUrl,
            user_id: userId
          }
        });

        if (error) {
          throw error;
        }

        return { success: true, data };
      }

      console.log('Calling property extraction webhook:', settings.property_extraction_url);

      const response = await fetch(settings.property_extraction_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          job_id: jobId,
          property_url: propertyUrl,
          user_id: userId,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`Webhook failed with status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };

    } catch (error) {
      console.error('Property extraction webhook error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown webhook error' 
      };
    }
  }

  static async callScriptGeneration(jobId: string, propertyData: any, userId: string): Promise<WebhookResponse> {
    try {
      const settings = await this.getUserWebhookSettings(userId);
      
      if (!settings?.script_generation_url) {
        console.log('No script generation webhook configured, using Edge Function fallback');
        
        // Fallback to Edge Function
        const { data, error } = await supabase.functions.invoke('script-generation', {
          body: {
            job_id: jobId,
            property_data: propertyData
          }
        });

        if (error) {
          throw error;
        }

        return { success: true, data };
      }

      console.log('Calling script generation webhook:', settings.script_generation_url);

      const response = await fetch(settings.script_generation_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          job_id: jobId,
          property_data: propertyData,
          user_id: userId,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`Webhook failed with status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };

    } catch (error) {
      console.error('Script generation webhook error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown webhook error' 
      };
    }
  }

  static async callVideoGeneration(jobId: string, scriptData: any, userId: string): Promise<WebhookResponse> {
    try {
      const settings = await this.getUserWebhookSettings(userId);
      
      if (!settings?.video_generation_url) {
        console.log('No video generation webhook configured, using Edge Function fallback');
        
        // Fallback to Edge Function
        const { data, error } = await supabase.functions.invoke('video-generation', {
          body: {
            job_id: jobId,
            script_data: scriptData
          }
        });

        if (error) {
          throw error;
        }

        return { success: true, data };
      }

      console.log('Calling video generation webhook:', settings.video_generation_url);

      const response = await fetch(settings.video_generation_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          job_id: jobId,
          script_data: scriptData,
          user_id: userId,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`Webhook failed with status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };

    } catch (error) {
      console.error('Video generation webhook error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown webhook error' 
      };
    }
  }
}
