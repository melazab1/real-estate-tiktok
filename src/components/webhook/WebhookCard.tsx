
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface WebhookCardProps {
  title: string;
  description: string;
  url: string;
  onUrlChange: (value: string) => void;
  fieldId: string;
  placeholder: string;
  receivesData: string;
}

export const WebhookCard = ({
  title,
  description,
  url,
  onUrlChange,
  fieldId,
  placeholder,
  receivesData
}: WebhookCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          {title}
          {url ? (
            <CheckCircle className="h-4 w-4 text-green-600 ml-2" />
          ) : (
            <AlertCircle className="h-4 w-4 text-orange-500 ml-2" />
          )}
        </CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor={fieldId}>Webhook URL</Label>
          <Input
            id={fieldId}
            type="url"
            placeholder={placeholder}
            value={url || ''}
            onChange={(e) => onUrlChange(e.target.value)}
          />
        </div>
        <div className="text-sm text-gray-500">
          Receives: {receivesData}
        </div>
      </CardContent>
    </Card>
  );
};
