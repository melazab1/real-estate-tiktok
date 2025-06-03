
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, DollarSign, MapPin, Bed, Bath, Square } from 'lucide-react';
import type { Property } from '@/types/job';

interface PropertyInfoCardProps {
  property: Property;
  onUpdateProperty: (field: keyof Property, value: any) => void;
  onToggleVisibility: (field: string) => void;
}

export const PropertyInfoCard = ({ 
  property, 
  onUpdateProperty, 
  onToggleVisibility 
}: PropertyInfoCardProps) => {
  const isVisible = property.is_visible || {};

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Edit className="h-5 w-5 mr-2" />
          Property Details
        </CardTitle>
        <CardDescription>Review and edit the property information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Title */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Property Title</label>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">Include in video</span>
              <Switch 
                checked={isVisible.title || false} 
                onCheckedChange={() => onToggleVisibility('title')}
              />
            </div>
          </div>
          <Input
            value={property.title || ''}
            onChange={(e) => onUpdateProperty('title', e.target.value)}
            placeholder="Enter property title"
            className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Price */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium flex items-center">
              <DollarSign className="h-4 w-4 mr-1 text-green-600" />
              <span className="text-gray-700">Price</span>
            </label>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">Include in video</span>
              <Switch 
                checked={isVisible.price || false} 
                onCheckedChange={() => onToggleVisibility('price')}
              />
            </div>
          </div>
          <Input
            type="number"
            value={property.price || ''}
            onChange={(e) => onUpdateProperty('price', parseInt(e.target.value) || 0)}
            placeholder="0"
            className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Location */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium flex items-center">
              <MapPin className="h-4 w-4 mr-1 text-red-600" />
              <span className="text-gray-700">Location</span>
            </label>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">Include in video</span>
              <Switch 
                checked={isVisible.location || false} 
                onCheckedChange={() => onToggleVisibility('location')}
              />
            </div>
          </div>
          <Input
            value={property.location || ''}
            onChange={(e) => onUpdateProperty('location', e.target.value)}
            placeholder="Enter location"
            className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Property Details Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center">
                <Bed className="h-4 w-4 mr-1 text-blue-600" />
                <span className="text-gray-700">Bedrooms</span>
              </label>
              <Switch 
                checked={isVisible.bedrooms || false} 
                onCheckedChange={() => onToggleVisibility('bedrooms')}
                className="scale-75"
              />
            </div>
            <Input
              type="number"
              value={property.bedrooms || ''}
              onChange={(e) => onUpdateProperty('bedrooms', parseInt(e.target.value) || 0)}
              placeholder="0"
              className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center">
                <Bath className="h-4 w-4 mr-1 text-cyan-600" />
                <span className="text-gray-700">Bathrooms</span>
              </label>
              <Switch 
                checked={isVisible.bathrooms || false} 
                onCheckedChange={() => onToggleVisibility('bathrooms')}
                className="scale-75"
              />
            </div>
            <Input
              type="number"
              value={property.bathrooms || ''}
              onChange={(e) => onUpdateProperty('bathrooms', parseInt(e.target.value) || 0)}
              placeholder="0"
              className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center">
                <Square className="h-4 w-4 mr-1 text-purple-600" />
                <span className="text-gray-700">Area (sq ft)</span>
              </label>
              <Switch 
                checked={isVisible.area || false} 
                onCheckedChange={() => onToggleVisibility('area')}
                className="scale-75"
              />
            </div>
            <Input
              type="number"
              value={property.area || ''}
              onChange={(e) => onUpdateProperty('area', parseInt(e.target.value) || 0)}
              placeholder="0"
              className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">Include in video</span>
              <Switch 
                checked={isVisible.description || false} 
                onCheckedChange={() => onToggleVisibility('description')}
              />
            </div>
          </div>
          <Textarea
            value={property.description || ''}
            onChange={(e) => onUpdateProperty('description', e.target.value)}
            placeholder="Enter property description"
            rows={4}
            className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
          />
        </div>
      </CardContent>
    </Card>
  );
};
