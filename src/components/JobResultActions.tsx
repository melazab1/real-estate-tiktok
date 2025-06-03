
import { Edit, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Video as VideoType } from '@/types/job';

interface JobResultActionsProps {
  video: VideoType;
  jobId: string;
  onEditScript: () => void;
  onCreateAnother: () => void;
}

export const JobResultActions = ({ video, onEditScript, onCreateAnother }: JobResultActionsProps) => {
  if (video.status !== 'completed') {
    return null;
  }

  return (
    <div className="flex gap-4">
      <Button variant="outline" onClick={onEditScript} className="flex-1">
        <Edit className="h-4 w-4 mr-2" />
        Edit Script
      </Button>
      <Button variant="outline" onClick={onCreateAnother} className="flex-1">
        <RotateCcw className="h-4 w-4 mr-2" />
        Create Another Video
      </Button>
    </div>
  );
};
