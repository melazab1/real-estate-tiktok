
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

interface NewJobFormProps {
  propertyUrl: string;
  setPropertyUrl: (url: string) => void;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export const NewJobForm = ({ 
  propertyUrl, 
  setPropertyUrl, 
  isSubmitting, 
  onSubmit 
}: NewJobFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Video Project</CardTitle>
        <CardDescription>
          Enter a property listing URL to get started. We support Zillow, Realtor.com, Redfin, and other major real estate sites.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
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
  );
};
