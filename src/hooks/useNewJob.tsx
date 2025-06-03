
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useNewJob = () => {
  const [propertyUrl, setPropertyUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const validateUrl = (url: string) => {
    const realEstatePatterns = [
      /zillow\.com/i,
      /realtor\.com/i,
      /redfin\.com/i,
      /homes\.com/i,
      /trulia\.com/i
    ];
    return realEstatePatterns.some(pattern => pattern.test(url));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!propertyUrl.trim()) {
      toast({ title: "Error", description: "Please enter a property URL", variant: "destructive" });
      return;
    }

    if (!validateUrl(propertyUrl)) {
      toast({ title: "Error", description: "Please enter a valid real estate listing URL", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const jobId = crypto.randomUUID();
      
      console.log('Creating job with automatic workflow:', jobId);
      
      // Insert job - this will automatically trigger the property extraction Edge Function
      const { error } = await supabase
        .from('jobs')
        .insert({
          job_id: jobId,
          user_id: user.id,
          property_url: propertyUrl,
          status: 'analyzing',
          current_step: 1
        });

      if (error) throw error;

      toast({ 
        title: "Success", 
        description: "Property submitted for analysis. The workflow will execute automatically!" 
      });
      
      // Navigate to review page where user can watch the progress
      navigate(`/job/${jobId}/review`);
    } catch (error) {
      console.error('Error creating job:', error);
      toast({ title: "Error", description: "Failed to submit property", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    propertyUrl,
    setPropertyUrl,
    isSubmitting,
    handleSubmit
  };
};
