
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Globe } from 'lucide-react';

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
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Create New Video Project
        </CardTitle>
        <CardDescription>
          Enter any property listing URL to get started. We accept URLs from all major real estate websites.
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
              type="text"
              value={propertyUrl}
              onChange={(e) => setPropertyUrl(e.target.value)}
              placeholder="www.zillow.com/homedetails/... or any property URL"
              className="w-full"
            />
            <div className="text-sm text-gray-500 mt-2">
              <p className="mb-1">✓ Accepts any real estate website URL</p>
              <p className="mb-1">✓ Examples:</p>
              <ul className="list-disc list-inside text-xs ml-2 space-y-0.5">
                <li>zillow.com/homedetails/123</li>
                <li>www.realtor.com/property/456</li>
                <li>redfin.com/property/789</li>
                <li>trulia.com/listing/abc</li>
              </ul>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              'Getting Property Information...'
            ) : (
              <>
                Get Property Information
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
