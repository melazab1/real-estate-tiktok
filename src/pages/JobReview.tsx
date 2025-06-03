
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumb } from '@/components/Breadcrumb';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { Video, Edit, Image as ImageIcon } from 'lucide-react';
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
        setProperty(propertyData);
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
          setProperty(createdProperty);
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

      // Create default script
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

  const isVisible = property.is_visible || {};

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Video className="h-8 w-8 text-blue-600 mr-2" />
              <span className="text-xl font-bold">VideoGen</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'New Project', href: '/new-job' },
          { label: 'Review Data' }
        ]} />

        <ProgressIndicator currentStep={2} totalSteps={4} stepLabel="Review & Edit Property Data" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Edit className="h-5 w-5 mr-2" />
                Property Details
              </CardTitle>
              <CardDescription>Review and edit the property information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Title</label>
                <Switch 
                  checked={isVisible.title || false} 
                  onCheckedChange={() => toggleVisibility('title')}
                />
              </div>
              <Input
                value={property.title || ''}
                onChange={(e) => updateProperty('title', e.target.value)}
                placeholder="Property title"
              />

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Price</label>
                <Switch 
                  checked={isVisible.price || false} 
                  onCheckedChange={() => toggleVisibility('price')}
                />
              </div>
              <Input
                type="number"
                value={property.price || ''}
                onChange={(e) => updateProperty('price', parseInt(e.target.value) || 0)}
                placeholder="Price"
              />

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Location</label>
                <Switch 
                  checked={isVisible.location || false} 
                  onCheckedChange={() => toggleVisibility('location')}
                />
              </div>
              <Input
                value={property.location || ''}
                onChange={(e) => updateProperty('location', e.target.value)}
                placeholder="Location"
              />

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm font-medium">Bedrooms</label>
                    <Switch 
                      checked={isVisible.bedrooms || false} 
                      onCheckedChange={() => toggleVisibility('bedrooms')}
                    />
                  </div>
                  <Input
                    type="number"
                    value={property.bedrooms || ''}
                    onChange={(e) => updateProperty('bedrooms', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm font-medium">Bathrooms</label>
                    <Switch 
                      checked={isVisible.bathrooms || false} 
                      onCheckedChange={() => toggleVisibility('bathrooms')}
                    />
                  </div>
                  <Input
                    type="number"
                    value={property.bathrooms || ''}
                    onChange={(e) => updateProperty('bathrooms', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm font-medium">Area (sq ft)</label>
                    <Switch 
                      checked={isVisible.area || false} 
                      onCheckedChange={() => toggleVisibility('area')}
                    />
                  </div>
                  <Input
                    type="number"
                    value={property.area || ''}
                    onChange={(e) => updateProperty('area', parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Description</label>
                <Switch 
                  checked={isVisible.description || false} 
                  onCheckedChange={() => toggleVisibility('description')}
                />
              </div>
              <Textarea
                value={property.description || ''}
                onChange={(e) => updateProperty('description', e.target.value)}
                placeholder="Property description"
                rows={3}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ImageIcon className="h-5 w-5 mr-2" />
                Property Images
              </CardTitle>
              <CardDescription>Manage property photos for the video</CardDescription>
            </CardHeader>
            <CardContent>
              {images.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {images.map((image) => (
                    <div key={image.id} className="relative">
                      <img 
                        src={image.image_url} 
                        alt="Property" 
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <Switch 
                        className="absolute top-2 right-2"
                        checked={image.is_visible || false}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No images found</p>
                  <p className="text-sm">Images will be extracted from the property listing</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
            <CardDescription>Add any extra details you want to include in the video</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={property.additional_info || ''}
              onChange={(e) => updateProperty('additional_info', e.target.value)}
              placeholder="Any additional information about the property..."
              rows={4}
            />
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button variant="outline" onClick={saveChanges} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button onClick={generateScript} className="flex-1">
            Generate Script
          </Button>
        </div>
      </main>
    </div>
  );
};

export default JobReview;
