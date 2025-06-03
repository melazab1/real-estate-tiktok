
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { usePropertyData } from './usePropertyData';
import { useImageUpload } from './useImageUpload';
import { useWebhookIntegration } from './useWebhookIntegration';
import type { Job } from '@/types/job';

export const useJobReview = () => {
  const { identifier } = useParams<{ identifier: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [job, setJob] = useState<Job | null>(null);
  const [jobError, setJobError] = useState<string | null>(null);
  const [propertyLoading, setPropertyLoading] = useState(false);

  // Use the focused hooks
  const {
    property,
    fetchProperty,
    createDefaultProperty,
    updateProperty,
    toggleVisibility,
    saveProperty
  } = usePropertyData(identifier);

  const {
    images,
    fetchImages,
    handleImageVisibilityChange,
    handleImagesUpload
  } = useImageUpload(identifier);

  const { generateScript } = useWebhookIntegration(identifier);

  useEffect(() => {
    if (identifier) {
      fetchJobData();
    }
  }, [identifier]);

  const fetchJobData = async () => {
    try {
      setLoading(true);
      setJobError(null);
      
      // First, fetch job data
      console.log('Fetching job data for identifier:', identifier);
      const { data: jobData, error: jobError } = await supabase
        .from('jobs')
        .select('*')
        .eq('display_id', identifier)
        .single();

      if (jobError) {
        console.error('Job fetch error:', jobError);
        setJobError('Job not found');
        return;
      }

      console.log('Job found:', jobData);
      setJob(jobData);

      // Try to fetch existing property
      console.log('Fetching property data...');
      const existingProperty = await fetchProperty();
      
      if (!existingProperty) {
        console.log('No property found, creating default property...');
        setPropertyLoading(true);
        
        try {
          await createDefaultProperty();
          console.log('Default property created successfully');
        } catch (error) {
          console.error('Error creating default property:', error);
          toast({ 
            title: "Warning", 
            description: "Could not create property data. Some features may not work properly.", 
            variant: "destructive" 
          });
        } finally {
          setPropertyLoading(false);
        }
      }

      // Fetch images (this can work even without property)
      try {
        await fetchImages();
      } catch (error) {
        console.error('Error fetching images:', error);
        // Don't block the UI for image errors
      }

    } catch (error) {
      console.error('Error in fetchJobData:', error);
      setJobError('Failed to load job data');
      toast({ 
        title: "Error", 
        description: "Failed to load job data", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  const saveChanges = async () => {
    setSaving(true);
    try {
      await saveProperty();
      toast({ title: "Success", description: "Changes saved successfully" });
    } catch (error) {
      console.error('Error saving changes:', error);
      toast({ title: "Error", description: "Failed to save changes", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateScript = async () => {
    await generateScript(property);
  };

  return {
    loading,
    saving,
    job,
    jobError,
    property,
    propertyLoading,
    images,
    updateProperty,
    toggleVisibility,
    handleImageVisibilityChange,
    handleImagesUpload,
    saveChanges,
    generateScript: handleGenerateScript
  };
};
