
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumb } from '@/components/Breadcrumb';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { Video, ArrowRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const NewJob = () => {
  const [propertyUrl, setPropertyUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const validateUrl = (url: string) => {
    const realEstatePatterns = [
      /zillow\.com/i,
      /realtor\.com/i,
      /redfin\.com/i,
      /homes\.com/i,
      /trulia\.com/i
    ];
    return realEstatePatterns.some(pattern => pattern.test(url));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!propertyUrl.trim()) {
      toast({ title: "Error", description: "Please enter a property URL", variant: "destructive" });
      return;
    }

    if (!validateUrl(propertyUrl)) {
      toast({ title: "Error", description: "Please enter a valid real estate listing URL", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const jobId = crypto.randomUUID();
      
      const { error } = await supabase
        .from('jobs')
        .insert({
          job_id: jobId,
          user_id: user.id,
          property_url: propertyUrl,
          status: 'analyzing',
          current_step: 1
        });

      if (error) throw error;

      toast({ title: "Success", description: "Property submitted for analysis" });
      navigate(`/job/${jobId}/review`);
    } catch (error) {
      console.error('Error creating job:', error);
      toast({ title: "Error", description: "Failed to submit property", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'New Project' }
        ]} />

        <ProgressIndicator currentStep={1} totalSteps={4} stepLabel="Submit Property URL" />

        <Card>
          <CardHeader>
            <CardTitle>Create New Video Project</CardTitle>
            <CardDescription>
              Enter a property listing URL to get started. We support Zillow, Realtor.com, Redfin, and other major real estate sites.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                  Property Listing URL
                </label>
                <Input
                  id="url"
                  type="url"
                  value={propertyUrl}
                  onChange={(e) => setPropertyUrl(e.target.value)}
                  placeholder="https://www.zillow.com/homedetails/..."
                  className="w-full"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Paste the URL of any property listing from supported real estate websites
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  'Analyzing Property...'
                ) : (
                  <>
                    Analyze Property
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default NewJob;
