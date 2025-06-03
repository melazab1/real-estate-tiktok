
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
      // Fetch job data
      const { data: jobData, error: jobError } = await supabase
        .from('jobs')
        .select('*')
        .eq('display_id', identifier)
        .single();

      if (jobError) throw jobError;
      setJob(jobData);

      // Fetch property data
      const existingProperty = await fetchProperty();
      if (!existingProperty) {
        await createDefaultProperty();
      }

      // Fetch images
      await fetchImages();
    } catch (error) {
      console.error('Error fetching job data:', error);
      toast({ title: "Error", description: "Failed to load job data", variant: "destructive" });
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
    property,
    images,
    updateProperty,
    toggleVisibility,
    handleImageVisibilityChange,
    handleImagesUpload,
    saveChanges,
    generateScript: handleGenerateScript
  };
};
