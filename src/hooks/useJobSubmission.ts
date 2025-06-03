
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
    if (!userId) return;

    setIsSubmitting(true);
    
    try {
      const jobId = JobService.generateJobId();
      const normalizedUrl = normalizeUrl(propertyUrl);
      
      console.log('Creating job with normalized URL:', normalizedUrl, 'Job ID:', jobId);
      
      // Create job record
      await JobService.createJob(jobId, userId, normalizedUrl);

      console.log('Job created successfully, calling property extraction webhook');

      // Call property extraction webhook directly
      const webhookResult = await WebhookService.callPropertyExtraction(jobId, normalizedUrl, userId);
      
      if (!webhookResult.success) {
        console.error('Property extraction webhook failed:', webhookResult.error);
        toast({ 
          title: "Processing Started with Warning", 
          description: "URL submitted but there was an issue with property extraction. You can retry from the review page.", 
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
      toast({ 
        title: "Error", 
        description: "Failed to submit URL. Please try again.", 
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
