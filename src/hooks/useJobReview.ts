
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { usePropertyData } from './usePropertyData';
import { useImageUpload } from './useImageUpload';
import { useWebhookIntegration } from './useWebhookIntegration';
import { useJobRealtime } from './useJobRealtime';
import type { Job } from '@/types/job';

export const useJobReview = () => {
  const { identifier } = useParams<{ identifier: string }>();
  const [saving, setSaving] = useState(false);
  const [propertyLoading, setPropertyLoading] = useState(false);
  const [dataInitialized, setDataInitialized] = useState(false);

  // Use the real-time job tracking
  const {
    job,
    loading: jobLoading,
    error: jobError,
    progress,
    detailedStatus,
    hasError,
    errorDetails
  } = useJobRealtime({
    displayId: identifier!,
    onStatusChange: (updatedJob) => {
      console.log('Job status updated:', updatedJob.status, updatedJob.detailed_status);
      
      // Show status updates to user
      if (updatedJob.detailed_status) {
        toast({
          title: "Status Update",
          description: updatedJob.detailed_status
        });
      }
    },
    onComplete: (completedJob) => {
      if (completedJob.status === 'completed') {
        toast({
          title: "Success",
          description: "Process completed successfully!"
        });
      } else if (completedJob.status === 'failed') {
        toast({
          title: "Error",
          description: errorDetails || "Process failed. Please try again.",
          variant: "destructive"
        });
      }
    },
    onError: (error) => {
      console.error('Real-time error:', error);
      toast({
        title: "Connection Error",
        description: "Lost connection to status updates. Please refresh the page.",
        variant: "destructive"
      });
    }
  });

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

  // Initialize data when job is available
  useEffect(() => {
    if (identifier && job && !dataInitialized) {
      console.log('Initializing data for job:', job.id);
      initializeData();
    }
  }, [identifier, job, dataInitialized]);

  const initializeData = async () => {
    if (!job || dataInitialized) return;
    
    setPropertyLoading(true);
    setDataInitialized(true);

    try {
      console.log('Fetching property data for job:', job.id);
      const existingProperty = await fetchProperty();
      
      if (!existingProperty) {
        console.log('No property found, creating default property...');
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
      console.error('Error in initializeData:', error);
      toast({ 
        title: "Error", 
        description: "Failed to load property data", 
        variant: "destructive" 
      });
    } finally {
      setPropertyLoading(false);
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
    loading: jobLoading,
    saving,
    job,
    jobError,
    property,
    propertyLoading,
    images,
    progress,
    detailedStatus,
    hasError,
    errorDetails,
    updateProperty,
    toggleVisibility,
    handleImageVisibilityChange,
    handleImagesUpload,
    saveChanges,
    generateScript: handleGenerateScript
  };
};
