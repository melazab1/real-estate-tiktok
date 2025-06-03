
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Globe, Loader2 } from 'lucide-react';

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
          Enter any HTTP/HTTPS URL to get started. We'll extract property information and begin processing immediately.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
              Website URL
            </label>
            <Input
              id="url"
              type="text"
              value={propertyUrl}
              onChange={(e) => setPropertyUrl(e.target.value)}
              placeholder="https://example.com or www.example.com"
              className="w-full"
              disabled={isSubmitting}
            />
            <div className="text-sm text-gray-500 mt-2">
              <p className="mb-1">✓ Accepts any HTTP/HTTPS URL</p>
              <p className="mb-1">✓ Examples:</p>
              <ul className="list-disc list-inside text-xs ml-2 space-y-0.5">
                <li>https://example.com</li>
                <li>www.example.com</li>
                <li>http://website.org/page</li>
                <li>subdomain.example.com</li>
              </ul>
            </div>
          </div>

          {isSubmitting && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Processing your URL...</p>
                  <p className="text-xs text-blue-700">Creating job and extracting property information</p>
                </div>
              </div>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing URL...
              </>
            ) : (
              <>
                Process URL & Extract Data
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
