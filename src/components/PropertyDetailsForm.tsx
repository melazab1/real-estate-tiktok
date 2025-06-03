
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit } from 'lucide-react';
import type { Property } from '@/types/job';

interface PropertyDetailsFormProps {
  property: Property;
  onUpdateProperty: (field: keyof Property, value: any) => void;
  onToggleVisibility: (field: string) => void;
}

export const PropertyDetailsForm = ({ 
  property, 
  onUpdateProperty, 
  onToggleVisibility 
}: PropertyDetailsFormProps) => {
  const isVisible = property.is_visible || {};

  return (
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
            onCheckedChange={() => onToggleVisibility('title')}
          />
        </div>
        <Input
          value={property.title || ''}
          onChange={(e) => onUpdateProperty('title', e.target.value)}
          placeholder="Property title"
        />

        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Price</label>
          <Switch 
            checked={isVisible.price || false} 
            onCheckedChange={() => onToggleVisibility('price')}
          />
        </div>
        <Input
          type="number"
          value={property.price || ''}
          onChange={(e) => onUpdateProperty('price', parseInt(e.target.value) || 0)}
          placeholder="Price"
        />

        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Location</label>
          <Switch 
            checked={isVisible.location || false} 
            onCheckedChange={() => onToggleVisibility('location')}
          />
        </div>
        <Input
          value={property.location || ''}
          onChange={(e) => onUpdateProperty('location', e.target.value)}
          placeholder="Location"
        />

        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium">Bedrooms</label>
              <Switch 
                checked={isVisible.bedrooms || false} 
                onCheckedChange={() => onToggleVisibility('bedrooms')}
              />
            </div>
            <Input
              type="number"
              value={property.bedrooms || ''}
              onChange={(e) => onUpdateProperty('bedrooms', parseInt(e.target.value) || 0)}
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium">Bathrooms</label>
              <Switch 
                checked={isVisible.bathrooms || false} 
                onCheckedChange={() => onToggleVisibility('bathrooms')}
              />
            </div>
            <Input
              type="number"
              value={property.bathrooms || ''}
              onChange={(e) => onUpdateProperty('bathrooms', parseInt(e.target.value) || 0)}
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium">Area (sq ft)</label>
              <Switch 
                checked={isVisible.area || false} 
                onCheckedChange={() => onToggleVisibility('area')}
              />
            </div>
            <Input
              type="number"
              value={property.area || ''}
              onChange={(e) => onUpdateProperty('area', parseInt(e.target.value) || 0)}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Description</label>
          <Switch 
            checked={isVisible.description || false} 
            onCheckedChange={() => onToggleVisibility('description')}
          />
        </div>
        <Textarea
          value={property.description || ''}
          onChange={(e) => onUpdateProperty('description', e.target.value)}
          placeholder="Property description"
          rows={3}
        />
      </CardContent>
    </Card>
  );
};
