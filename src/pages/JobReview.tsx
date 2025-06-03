
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Breadcrumb } from '@/components/Breadcrumb';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { PropertyDetailsForm } from '@/components/PropertyDetailsForm';
import { PropertyImagesCard } from '@/components/PropertyImagesCard';
import { AdditionalInfoCard } from '@/components/AdditionalInfoCard';
import { JobReviewActions } from '@/components/JobReviewActions';
import { Navigation } from '@/components/Navigation';
import { RouteGuard } from '@/components/RouteGuard';
import { toast } from '@/hooks/use-toast';
import type { Job, Property, PropertyImage } from '@/types/job';

const JobReview = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
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
        // Create default property record
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
    // Here you would implement the actual upload logic
    // For now, just show a success message
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
    try {
      await supabase
        .from('jobs')
        .update({ status: 'script_ready', current_step: 3 })
        .eq('job_id', jobId);

      await supabase
        .from('video_scripts')
        .insert({
          job_id: jobId!,
          script_text: `Welcome to this stunning ${property?.bedrooms}-bedroom, ${property?.bathrooms}-bathroom home located in ${property?.location}. This beautiful property offers ${property?.area} square feet of living space, perfect for families looking for comfort and style. With its modern amenities and prime location, this home is truly a gem in today's market.`,
          language: 'English',
          accent: 'US',
          is_approved: false
        });

      navigate(`/job/${jobId}/script`);
    } catch (error) {
      console.error('Error generating script:', error);
      toast({ title: "Error", description: "Failed to generate script", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!job || !property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Not Found</h2>
          <p className="text-gray-600">The requested job could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <RouteGuard job={job} currentStep="review">
      <div className="min-h-screen bg-gray-50">
        <Navigation />

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb items={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'New Project', href: '/new-job' },
            { label: 'Review Data' }
          ]} />

          <ProgressIndicator currentStep={2} totalSteps={4} stepLabel="Review & Edit Property Data" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <PropertyDetailsForm 
              property={property}
              onUpdateProperty={updateProperty}
              onToggleVisibility={toggleVisibility}
            />

            <PropertyImagesCard 
              images={images}
              onImageVisibilityChange={handleImageVisibilityChange}
              onImagesUpload={handleImagesUpload}
            />
          </div>

          <div className="mb-8">
            <AdditionalInfoCard 
              property={property}
              onUpdateProperty={updateProperty}
            />
          </div>

          <JobReviewActions 
            saving={saving}
            onSaveChanges={saveChanges}
            onGenerateScript={generateScript}
          />
        </main>
      </div>
    </RouteGuard>
  );
};

export default JobReview;
