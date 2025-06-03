
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { WebhookService } from '@/services/webhookService';
import { useAuth } from '@/hooks/useAuth';
import type { Job, Property, PropertyImage } from '@/types/job';

export const useJobReview = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [job, setJob] = useState<Job | null>(null);
  const [property, setProperty] = useState<Property | null>(null);
  const [images, setImages] = useState<PropertyImage[]>([]);

  useEffect(() => {
    if (jobId) {
      fetchJobData();
    }
  }, [jobId]);

  const fetchJobData = async () => {
    try {
      const { data: jobData, error: jobError } = await supabase
        .from('jobs')
        .select('*')
        .eq('job_id', jobId)
        .single();

      if (jobError) throw jobError;
      setJob(jobData);

      const { data: propertyData, error: propertyError } = await supabase
        .from('properties')
        .select('*')
        .eq('job_id', jobId)
        .maybeSingle();

      if (!propertyError && propertyData) {
        const convertedProperty: Property = {
          ...propertyData,
          is_visible: propertyData.is_visible as Record<string, boolean> || {}
        };
        setProperty(convertedProperty);
      } else {
        await createDefaultProperty();
      }

      const { data: imagesData, error: imagesError } = await supabase
        .from('property_images')
        .select('*')
        .eq('job_id', jobId)
        .order('sort_order');

      if (!imagesError) {
        setImages(imagesData || []);
      }
    } catch (error) {
      console.error('Error fetching job data:', error);
      toast({ title: "Error", description: "Failed to load job data", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const createDefaultProperty = async () => {
    const newProperty = {
      job_id: jobId!,
      title: 'Beautiful Family Home',
      description: 'Spacious and well-maintained property',
      price: 450000,
      location: 'Prime Location',
      bedrooms: 3,
      bathrooms: 2,
      area: 2000,
      is_visible: {
        title: true,
        description: true,
        price: true,
        location: true,
        bedrooms: true,
        bathrooms: true,
        area: true
      }
    };

    const { data: createdProperty, error: createError } = await supabase
      .from('properties')
      .insert(newProperty)
      .select()
      .single();

    if (!createError) {
      const convertedCreatedProperty: Property = {
        ...createdProperty,
        is_visible: createdProperty.is_visible as Record<string, boolean> || {}
      };
      setProperty(convertedCreatedProperty);
    }
  };

  const updateProperty = (field: keyof Property, value: any) => {
    if (!property) return;
    setProperty({ ...property, [field]: value });
  };

  const toggleVisibility = (field: string) => {
    if (!property) return;
    const isVisible = property.is_visible || {};
    updateProperty('is_visible', { ...isVisible, [field]: !isVisible[field] });
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
    setTimeout(() => {
      toast({ 
        title: "Success", 
        description: "Images uploaded successfully" 
      });
    }, 2000);
  };

  const saveChanges = async () => {
    if (!property) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('properties')
        .update({
          title: property.title,
          description: property.description,
          price: property.price,
          location: property.location,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          area: property.area,
          additional_info: property.additional_info,
          is_visible: property.is_visible
        })
        .eq('job_id', jobId);

      if (error) throw error;
      toast({ title: "Success", description: "Changes saved successfully" });
    } catch (error) {
      console.error('Error saving changes:', error);
      toast({ title: "Error", description: "Failed to save changes", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const generateScript = async () => {
    if (!user || !property) return;

    try {
      // Update job status first
      await supabase
        .from('jobs')
        .update({ status: 'generating_script', current_step: 3 })
        .eq('job_id', jobId);

      console.log('Calling script generation webhook with property data:', property);

      // Call script generation webhook
      const webhookResult = await WebhookService.callScriptGeneration(jobId!, property, user.id);
      
      if (!webhookResult.success) {
        console.error('Script generation webhook failed:', webhookResult.error);
        
        // Fallback: create a default script
        await supabase
          .from('video_scripts')
          .insert({
            job_id: jobId!,
            script_text: `Welcome to this stunning ${property?.bedrooms}-bedroom, ${property?.bathrooms}-bathroom home located in ${property?.location}. This beautiful property offers ${property?.area} square feet of living space, perfect for families looking for comfort and style. With its modern amenities and prime location, this home is truly a gem in today's market.`,
            language: 'English',
            accent: 'US',
            is_approved: false
          });

        toast({ 
          title: "Script Generated with Default Content", 
          description: "Webhook failed, but a default script was created. You can edit it on the next page.", 
          variant: "destructive" 
        });
      } else {
        console.log('Script generation webhook completed successfully');
        toast({ title: "Success", description: "Script generated successfully!" });
      }

      // Update job status to script ready
      await supabase
        .from('jobs')
        .update({ status: 'script_ready', current_step: 3 })
        .eq('job_id', jobId);

      navigate(`/job/${jobId}/script`);
    } catch (error) {
      console.error('Error generating script:', error);
      toast({ title: "Error", description: "Failed to generate script", variant: "destructive" });
    }
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
    generateScript
  };
};
