
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
      
      console.log('Validating URL:', normalizedUrl);
      
      // Create URL object to validate format
      const urlObj = new URL(normalizedUrl);
      
      console.log('URL object created:', {
        protocol: urlObj.protocol,
        hostname: urlObj.hostname,
        pathname: urlObj.pathname,
        search: urlObj.search,
        hash: urlObj.hash
      });
      
      // Must use HTTP or HTTPS protocol
      if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
        console.log('Invalid protocol:', urlObj.protocol);
        return false;
      }
      
      // Must have valid hostname
      if (!urlObj.hostname || urlObj.hostname.length < 3) {
        console.log('Invalid hostname:', urlObj.hostname);
        return false;
      }
      
      // Must contain at least one dot (like example.com)
      if (!urlObj.hostname.includes('.')) {
        console.log('Hostname missing dot:', urlObj.hostname);
        return false;
      }
      
      console.log('URL validation passed');
      return true;
    } catch (error) {
      console.log('URL validation error:', error);
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
      toast({ title: "Error", description: "Please enter a URL", variant: "destructive" });
      return;
    }

    console.log('Submitting URL:', propertyUrl);

    if (!validateUrl(propertyUrl)) {
      toast({ 
        title: "Invalid URL", 
        description: "Please enter a valid HTTP/HTTPS URL (e.g., https://example.com or www.example.com)", 
        variant: "destructive" 
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const jobId = crypto.randomUUID();
      const normalizedUrl = normalizeUrl(propertyUrl);
      
      console.log('Creating job with normalized URL:', normalizedUrl, 'Job ID:', jobId);
      
      // Insert job - this will automatically trigger the property extraction Edge Function via database trigger
      const { error: jobError } = await supabase
        .from('jobs')
        .insert({
          job_id: jobId,
          user_id: user.id,
          property_url: normalizedUrl,
          status: 'analyzing',
          current_step: 1
        });

      if (jobError) {
        console.error('Error creating job:', jobError);
        throw jobError;
      }

      console.log('Job created successfully - database trigger will automatically call property extraction');

      toast({ 
        title: "Success", 
        description: "URL submitted successfully! We're getting the information now." 
      });
      
      // Navigate to review page where user can watch the progress
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
    propertyUrl,
    setPropertyUrl,
    isSubmitting,
    handleSubmit
  };
};
