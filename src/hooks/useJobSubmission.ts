
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { JobService } from '@/services/jobService';
import { WebhookService } from '@/services/webhookService';
import { normalizeUrl } from '@/utils/urlValidation';
import { getJobIdentifier } from '@/utils/routeUtils';

export const useJobSubmission = (userId: string | undefined) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const submitJob = async (propertyUrl: string): Promise<void> => {
    if (!userId) {
      toast({ 
        title: "Authentication Required", 
        description: "Please log in to submit a URL.", 
        variant: "destructive" 
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const normalizedUrl = normalizeUrl(propertyUrl);
      
      console.log('Creating job with normalized URL:', normalizedUrl);
      
      // Create job record first - display_id will be auto-generated
      await JobService.createJob('', userId, normalizedUrl);
      console.log('Job created successfully in database');

      // Since we can't predict the display_id, we need to fetch the latest job for this user
      const { data: latestJob } = await supabase
        .from('jobs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (!latestJob) {
        throw new Error('Failed to retrieve created job');
      }

      const jobIdentifier = getJobIdentifier(latestJob);

      // Navigate to loading page immediately for better UX
      navigate(`/job/${jobIdentifier}/submission-loading`);

      // Call property extraction webhook in background
      console.log('Calling property extraction webhook');
      const webhookResult = await WebhookService.callPropertyExtraction(latestJob.display_id, normalizedUrl, userId);
      
      if (!webhookResult.success) {
        console.error('Property extraction webhook failed:', webhookResult.error);
        toast({ 
          title: "Processing Started with Warning", 
          description: "URL submitted successfully, but there was an issue with property extraction. You can retry from the review page.", 
          variant: "destructive" 
        });
      } else {
        console.log('Property extraction webhook completed successfully');
      }
      
    } catch (error) {
      console.error('Error creating job:', error);
      
      // Provide more specific error messages
      let errorMessage = "Failed to submit URL. Please try again.";
      
      if (error instanceof Error) {
        if (error.message.includes('fetch')) {
          errorMessage = "Network error. Please check your connection and try again.";
        } else if (error.message.includes('duplicate')) {
          errorMessage = "This job already exists. Please try a different URL.";
        } else if (error.message.includes('permission')) {
          errorMessage = "Permission denied. Please log in and try again.";
        }
      }
      
      toast({ 
        title: "Error", 
        description: errorMessage, 
        variant: "destructive" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    submitJob
  };
};
