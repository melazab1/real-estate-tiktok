
import { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ImageUploadProps {
  onImagesUpload: (files: File[]) => void;
  maxImages?: number;
}

export const ImageUpload = ({ onImagesUpload, maxImages = 10 }: ImageUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );

    if (files.length === 0) {
      toast({
        title: "Invalid files",
        description: "Please upload only image files",
        variant: "destructive"
      });
      return;
    }

    if (files.length > maxImages) {
      toast({
        title: "Too many files",
        description: `Maximum ${maxImages} images allowed`,
        variant: "destructive"
      });
      return;
    }

    // Create preview URLs
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewImages(urls);
    
    onImagesUpload(files);
  }, [onImagesUpload, maxImages]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length > 0) {
      const urls = files.map(file => URL.createObjectURL(file));
      setPreviewImages(urls);
      onImagesUpload(files);
    }
  };

  const removeImage = (index: number) => {
    const newPreviews = previewImages.filter((_, i) => i !== index);
    setPreviewImages(newPreviews);
    URL.revokeObjectURL(previewImages[index]);
  };

  return (
    <div className="space-y-4">
      <Card
        className={`border-2 border-dashed transition-colors ${
          isDragOver 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center space-y-4">
            <Upload className="h-12 w-12 text-gray-400" />
            <div>
              <h3 className="text-lg font-medium">Upload Additional Images</h3>
              <p className="text-gray-500 mb-4">
                Drag and drop images here, or click to select files
              </p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="image-upload"
              />
              <Button asChild variant="outline">
                <label htmlFor="image-upload" className="cursor-pointer">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Choose Images
                </label>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {previewImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {previewImages.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url}
                alt={`Preview ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
              />
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
