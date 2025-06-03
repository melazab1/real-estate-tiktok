
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { validateUrl } from '@/utils/urlValidation';

export const useNewJobForm = () => {
  const [propertyUrl, setPropertyUrl] = useState('');

  const validateForm = (): boolean => {
    if (!propertyUrl.trim()) {
      toast({ title: "Error", description: "Please enter a URL", variant: "destructive" });
      return false;
    }

    console.log('Submitting URL:', propertyUrl);

    if (!validateUrl(propertyUrl)) {
      toast({ 
        title: "Invalid URL", 
        description: "Please enter a valid HTTP/HTTPS URL (e.g., https://example.com or www.example.com)", 
        variant: "destructive" 
      });
      return false;
    }

    return true;
  };

  return {
    propertyUrl,
    setPropertyUrl,
    validateForm
  };
};
