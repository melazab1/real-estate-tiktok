
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Property } from '@/types/job';

interface AdditionalInfoCardProps {
  property: Property;
  onUpdateProperty: (field: keyof Property, value: any) => void;
}

export const AdditionalInfoCard = ({ property, onUpdateProperty }: AdditionalInfoCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Additional Information</CardTitle>
        <CardDescription>Add any extra details you want to include in the video</CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          value={property.additional_info || ''}
          onChange={(e) => onUpdateProperty('additional_info', e.target.value)}
          placeholder="Any additional information about the property..."
          rows={4}
        />
      </CardContent>
    </Card>
  );
};
