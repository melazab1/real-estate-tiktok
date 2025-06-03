
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Video as VideoType } from '@/types/job';

interface JobResultActionsProps {
  video: VideoType;
  jobId: string;
  onEditScript: () => void;
  onCreateAnother: () => void;
}

export const JobResultActions = ({ video, onCreateAnother }: JobResultActionsProps) => {
  if (video.status !== 'completed') {
    return null;
  }

  return (
    <div className="flex justify-center">
      <Button variant="outline" onClick={onCreateAnother} className="px-8">
        <RotateCcw className="h-4 w-4 mr-2" />
        Create Another Video
      </Button>
    </div>
  );
};
