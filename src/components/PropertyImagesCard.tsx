
import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Image as ImageIcon } from 'lucide-react';
import { ImageUpload } from '@/components/ImageUpload';
import type { PropertyImage } from '@/types/job';

interface PropertyImagesCardProps {
  images: PropertyImage[];
  onImageVisibilityChange?: (imageId: string, isVisible: boolean) => void;
  onImagesUpload?: (files: File[]) => void;
}

export const PropertyImagesCard = ({ 
  images, 
  onImageVisibilityChange,
  onImagesUpload 
}: PropertyImagesCardProps) => {
  const [imageVisibility, setImageVisibility] = useState<Record<string, boolean>>(
    Object.fromEntries(images.map(img => [img.id, img.is_visible ?? true]))
  );

  const handleVisibilityToggle = (imageId: string, checked: boolean) => {
    setImageVisibility(prev => ({ ...prev, [imageId]: checked }));
    onImageVisibilityChange?.(imageId, checked);
  };

  const handleImagesUpload = (files: File[]) => {
    onImagesUpload?.(files);
  };

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center">
          <ImageIcon className="h-5 w-5 mr-2" />
          Property Images
        </CardTitle>
        <CardDescription>Manage property photos for the video</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {images.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {images.map((image) => (
              <div key={image.id} className="relative group">
                <div className="relative overflow-hidden rounded-lg">
                  <img 
                    src={image.image_url} 
                    alt="Property" 
                    className="w-full h-40 object-cover transition-opacity group-hover:opacity-90"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200" />
                </div>
                <div className="flex items-center justify-between mt-2 p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">Include in video</span>
                  <Switch 
                    checked={imageVisibility[image.id] ?? true}
                    onCheckedChange={(checked) => handleVisibilityToggle(image.id, checked)}
                  />
                </div>
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

        <div className="border-t pt-6">
          <ImageUpload onImagesUpload={handleImagesUpload} />
        </div>
      </CardContent>
    </Card>
  );
};
