
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { Property } from '@/types/job';
import { sanitizePropertyValue } from '@/validation/propertyValidation';

export const usePropertyData = (displayId: string | undefined) => {
  const [property, setProperty] = useState<Property | null>(null);

  const fetchProperty = async () => {
    if (!displayId) return null;

    // First get the job to get the job_id
    const { data: jobData, error: jobError } = await supabase
      .from('jobs')
      .select('id')
      .eq('display_id', displayId)
      .single();

    if (jobError || !jobData) {
      console.error('Error fetching job:', jobError);
      return null;
    }

    // Then get the property using job_id
    const { data: propertyData, error: propertyError } = await supabase
      .from('properties')
      .select('*')
      .eq('job_id', jobData.id)
      .maybeSingle();

    if (!propertyError && propertyData) {
      const convertedProperty: Property = {
        ...propertyData,
        is_visible: propertyData.is_visible as Record<string, boolean> || {}
      };
      setProperty(convertedProperty);
      return convertedProperty;
    }

    return null;
  };

  const createDefaultProperty = async () => {
    if (!displayId) return null;

    // First get the job to get the job_id
    const { data: jobData, error: jobError } = await supabase
      .from('jobs')
      .select('id')
      .eq('display_id', displayId)
      .single();

    if (jobError || !jobData) {
      console.error('Error fetching job:', jobError);
      return null;
    }

    const newProperty = {
      job_id: jobData.id,
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
      return convertedCreatedProperty;
    }

    return null;
  };

  const updateProperty = (field: keyof Property, value: any) => {
    if (!property) return;
    
    const sanitizedValue = sanitizePropertyValue(field, value);
    setProperty({ ...property, [field]: sanitizedValue });
  };

  const toggleVisibility = (field: string) => {
    if (!property) return;
    const isVisible = property.is_visible || {};
    updateProperty('is_visible', { ...isVisible, [field]: !isVisible[field] });
  };

  const saveProperty = async () => {
    if (!property || !displayId) return false;
    
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
        .eq('id', property.id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error saving property:', error);
      throw error;
    }
  };

  return {
    property,
    setProperty,
    fetchProperty,
    createDefaultProperty,
    updateProperty,
    toggleVisibility,
    saveProperty
  };
};
