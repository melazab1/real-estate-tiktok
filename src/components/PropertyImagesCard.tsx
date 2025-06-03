
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Image as ImageIcon } from 'lucide-react';
import type { PropertyImage } from '@/types/job';

interface PropertyImagesCardProps {
  images: PropertyImage[];
}

export const PropertyImagesCard = ({ images }: PropertyImagesCardProps) => {
  return (
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
  );
};
