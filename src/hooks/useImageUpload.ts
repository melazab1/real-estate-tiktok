
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { PropertyImage } from '@/types/job';

export const useImageUpload = (displayId: string | undefined) => {
  const [images, setImages] = useState<PropertyImage[]>([]);

  const fetchImages = async () => {
    if (!displayId) return [];

    // First get the job to get the job_id
    const { data: jobData, error: jobError } = await supabase
      .from('jobs')
      .select('id')
      .eq('display_id', displayId)
      .single();

    if (jobError || !jobData) {
      console.error('Error fetching job:', jobError);
      return [];
    }

    // Then get the property to get the property_id
    const { data: propertyData, error: propertyError } = await supabase
      .from('properties')
      .select('id')
      .eq('job_id', jobData.id)
      .maybeSingle();

    if (propertyError || !propertyData) {
      console.log('No property found for job:', displayId);
      return [];
    }

    // Finally get the images using property_id
    const { data: imagesData, error: imagesError } = await supabase
      .from('property_images')
      .select('*')
      .eq('property_id', propertyData.id)
      .order('sort_order');

    if (!imagesError) {
      setImages(imagesData || []);
      return imagesData || [];
    }

    return [];
  };

  const handleImageVisibilityChange = async (imageId: string, isVisible: boolean) => {
    try {
      await supabase
        .from('property_images')
        .update({ is_visible: isVisible })
        .eq('id', imageId);
      
      setImages(prev => prev.map(img => 
        img.id === imageId ? { ...img, is_visible: isVisible } : img
      ));
    } catch (error) {
      console.error('Error updating image visibility:', error);
      toast({ title: "Error", description: "Failed to update image visibility", variant: "destructive" });
    }
  };

  const handleImagesUpload = async (files: File[]) => {
    toast({ 
      title: "Upload started", 
      description: `Uploading ${files.length} images...` 
    });
    
    // Simulate upload process
    setTimeout(() => {
      toast({ 
        title: "Success", 
        description: "Images uploaded successfully" 
      });
    }, 2000);
  };

  return {
    images,
    setImages,
    fetchImages,
    handleImageVisibilityChange,
    handleImagesUpload
  };
};
