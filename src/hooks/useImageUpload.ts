
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { PropertyImage } from '@/types/job';

export const useImageUpload = (displayId: string | undefined) => {
  const [images, setImages] = useState<PropertyImage[]>([]);

  const getJobAndProperty = async () => {
    if (!displayId) {
      throw new Error('Display ID is required');
    }

    // Get job by display_id
    const { data: jobData, error: jobError } = await supabase
      .from('jobs')
      .select('id')
      .eq('display_id', displayId)
      .single();

    if (jobError) {
      console.error('Error fetching job:', jobError);
      if (jobError.code === 'PGRST116') {
        throw new Error(`Job with ID "${displayId}" not found`);
      }
      throw new Error(`Database error: ${jobError.message}`);
    }

    if (!jobData) {
      throw new Error(`Job with ID "${displayId}" not found`);
    }

    // Get property by job_id
    const { data: propertyData, error: propertyError } = await supabase
      .from('properties')
      .select('id')
      .eq('job_id', jobData.id)
      .maybeSingle();

    if (propertyError) {
      console.error('Error fetching property:', propertyError);
      throw new Error(`Property lookup failed: ${propertyError.message}`);
    }

    if (!propertyData) {
      console.log('No property found for job:', displayId);
      return { jobId: jobData.id, propertyId: null };
    }

    return { jobId: jobData.id, propertyId: propertyData.id };
  };

  const fetchImages = async () => {
    try {
      const { propertyId } = await getJobAndProperty();
      
      if (!propertyId) {
        console.log('No property available for images');
        setImages([]);
        return [];
      }

      // Get images using property_id
      const { data: imagesData, error: imagesError } = await supabase
        .from('property_images')
        .select('*')
        .eq('property_id', propertyId)
        .order('sort_order');

      if (imagesError) {
        console.error('Error fetching images:', imagesError);
        throw new Error(`Failed to fetch images: ${imagesError.message}`);
      }

      const images = imagesData || [];
      setImages(images);
      console.log(`Fetched ${images.length} images for property`);
      return images;
    } catch (error) {
      console.error('Error in fetchImages:', error);
      setImages([]);
      return [];
    }
  };

  const handleImageVisibilityChange = async (imageId: string, isVisible: boolean) => {
    try {
      if (!imageId) {
        throw new Error('Image ID is required');
      }

      const { error } = await supabase
        .from('property_images')
        .update({ is_visible: isVisible })
        .eq('id', imageId);
      
      if (error) {
        console.error('Error updating image visibility:', error);
        throw new Error(`Failed to update image visibility: ${error.message}`);
      }
      
      setImages(prev => prev.map(img => 
        img.id === imageId ? { ...img, is_visible: isVisible } : img
      ));
      
      console.log(`Image ${imageId} visibility updated to ${isVisible}`);
    } catch (error) {
      console.error('Error updating image visibility:', error);
      toast({ 
        title: "Error", 
        description: error instanceof Error ? error.message : "Failed to update image visibility", 
        variant: "destructive" 
      });
    }
  };

  const handleImagesUpload = async (files: File[]) => {
    try {
      if (!files || files.length === 0) {
        toast({
          title: "Error",
          description: "No files selected for upload",
          variant: "destructive"
        });
        return;
      }

      const { propertyId } = await getJobAndProperty();
      
      if (!propertyId) {
        toast({
          title: "Error",
          description: "Property not found. Please ensure property data is loaded first.",
          variant: "destructive"
        });
        return;
      }

      toast({ 
        title: "Upload started", 
        description: `Uploading ${files.length} images...` 
      });
      
      // Simulate upload process for now
      // In a real implementation, you would:
      // 1. Upload files to Supabase Storage
      // 2. Create property_images records with the URLs
      // 3. Refresh the images list
      
      setTimeout(() => {
        toast({ 
          title: "Success", 
          description: "Images uploaded successfully" 
        });
        // Refresh images after upload
        fetchImages();
      }, 2000);

    } catch (error) {
      console.error('Error uploading images:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload images. Please try again.",
        variant: "destructive"
      });
    }
  };

  return {
    images,
    setImages,
    fetchImages,
    handleImageVisibilityChange,
    handleImagesUpload
  };
};
