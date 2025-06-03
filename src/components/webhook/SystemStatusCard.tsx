
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

export const SystemStatusCard = () => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
          System Status: Direct Webhook Integration
        </CardTitle>
        <CardDescription>
          Your VideoGen system now uses direct webhook calls for better reliability and user feedback.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm">Direct Frontend Calls</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm">Edge Function Fallback</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-sm">Real-time Error Handling</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
