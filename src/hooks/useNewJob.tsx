
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
    try {
      // Add https:// if no protocol is provided
      let normalizedUrl = url.trim();
      if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
        normalizedUrl = 'https://' + normalizedUrl;
      }
      
      // Create URL object to validate format
      const urlObj = new URL(normalizedUrl);
      
      // Basic validation: must have valid domain
      if (!urlObj.hostname || urlObj.hostname.length < 3) {
        return false;
      }
      
      // Must contain at least one dot (like example.com)
      if (!urlObj.hostname.includes('.')) {
        return false;
      }
      
      return true;
    } catch (error) {
      return false;
    }
  };

  const normalizeUrl = (url: string) => {
    let normalizedUrl = url.trim();
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = 'https://' + normalizedUrl;
    }
    return normalizedUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!propertyUrl.trim()) {
      toast({ title: "Error", description: "Please enter a property URL", variant: "destructive" });
      return;
    }

    if (!validateUrl(propertyUrl)) {
      toast({ 
        title: "Invalid URL", 
        description: "Please enter a valid URL format (e.g., www.example.com/property or https://example.com/listing)", 
        variant: "destructive" 
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const jobId = crypto.randomUUID();
      const normalizedUrl = normalizeUrl(propertyUrl);
      
      console.log('Creating job with normalized URL:', normalizedUrl, 'Job ID:', jobId);
      
      // Insert job - this will automatically trigger the property extraction Edge Function
      const { error } = await supabase
        .from('jobs')
        .insert({
          job_id: jobId,
          user_id: user.id,
          property_url: normalizedUrl,
          status: 'analyzing',
          current_step: 1
        });

      if (error) {
        console.error('Error creating job:', error);
        throw error;
      }

      toast({ 
        title: "Success", 
        description: "Property submitted successfully! We're getting the property information now." 
      });
      
      // Navigate to review page where user can watch the progress
      navigate(`/job/${jobId}/review`);
    } catch (error) {
      console.error('Error creating job:', error);
      toast({ 
        title: "Error", 
        description: "Failed to submit property. Please try again.", 
        variant: "destructive" 
      });
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
