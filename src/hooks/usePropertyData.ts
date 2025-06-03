
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { Property } from '@/types/job';
import { sanitizePropertyValue } from '@/validation/propertyValidation';

export const usePropertyData = (displayId: string | undefined) => {
  const [property, setProperty] = useState<Property | null>(null);

  const getJobId = async () => {
    if (!displayId) {
      throw new Error('Display ID is required');
    }

    const { data: jobData, error: jobError } = await supabase
      .from('jobs')
      .select('id')
      .eq('display_id', displayId)
      .single();

    if (jobError || !jobData) {
      console.error('Error fetching job:', jobError);
      throw new Error(`Job not found: ${jobError?.message || 'Unknown error'}`);
    }

    return jobData.id;
  };

  const fetchProperty = async () => {
    try {
      const jobId = await getJobId();

      // Get property using job_id
      const { data: propertyData, error: propertyError } = await supabase
        .from('properties')
        .select('*')
        .eq('job_id', jobId)
        .maybeSingle();

      if (propertyError) {
        console.error('Error fetching property:', propertyError);
        throw propertyError;
      }

      if (propertyData) {
        const convertedProperty: Property = {
          ...propertyData,
          is_visible: propertyData.is_visible as Record<string, boolean> || {}
        };
        setProperty(convertedProperty);
        return convertedProperty;
      }

      return null;
    } catch (error) {
      console.error('Error in fetchProperty:', error);
      throw error;
    }
  };

  const createDefaultProperty = async () => {
    try {
      const jobId = await getJobId();

      const newProperty = {
        job_id: jobId,
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

      if (createError) {
        console.error('Error creating property:', createError);
        throw createError;
      }

      const convertedCreatedProperty: Property = {
        ...createdProperty,
        is_visible: createdProperty.is_visible as Record<string, boolean> || {}
      };
      setProperty(convertedCreatedProperty);
      return convertedCreatedProperty;
    } catch (error) {
      console.error('Error in createDefaultProperty:', error);
      throw error;
    }
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
    if (!property || !displayId) {
      throw new Error('Property and display ID are required');
    }
    
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

      if (error) {
        console.error('Error saving property:', error);
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Error in saveProperty:', error);
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
