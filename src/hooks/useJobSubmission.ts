
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { JobService } from '@/services/jobService';
import { WebhookService } from '@/services/webhookService';
import { normalizeUrl } from '@/utils/urlValidation';

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
      const jobId = JobService.generateJobId();
      const normalizedUrl = normalizeUrl(propertyUrl);
      
      console.log('Creating job with normalized URL:', normalizedUrl, 'Job ID:', jobId);
      
      // Create job record first
      await JobService.createJob(jobId, userId, normalizedUrl);
      console.log('Job created successfully in database');

      // Call property extraction webhook
      console.log('Calling property extraction webhook');
      const webhookResult = await WebhookService.callPropertyExtraction(jobId, normalizedUrl, userId);
      
      if (!webhookResult.success) {
        console.error('Property extraction webhook failed:', webhookResult.error);
        toast({ 
          title: "Processing Started with Warning", 
          description: "URL submitted successfully, but there was an issue with property extraction. You can retry from the review page.", 
          variant: "destructive" 
        });
      } else {
        console.log('Property extraction webhook completed successfully');
        toast({ 
          title: "Success", 
          description: "URL submitted successfully! We're extracting the property information now." 
        });
      }
      
      // Navigate to review page regardless of webhook status
      navigate(`/job/${jobId}/review`);
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
