
import { Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import type { Video as VideoType } from '@/types/job';

interface VideoActionsProps {
  video: VideoType;
}

export const VideoActions = ({ video }: VideoActionsProps) => {
  const downloadVideo = () => {
    if (video?.video_url) {
      window.open(video.video_url, '_blank');
    }
  };

  const shareVideo = () => {
    if (video?.video_url) {
      navigator.clipboard.writeText(video.video_url);
      toast({ title: "Success", description: "Video link copied to clipboard" });
    }
  };

  if (video.status !== 'completed') {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Button onClick={downloadVideo} size="lg" className="h-14 text-lg">
        <Download className="h-5 w-5 mr-3" />
        Download Video
      </Button>
      <Button variant="outline" onClick={shareVideo} size="lg" className="h-14 text-lg">
        <Share2 className="h-5 w-5 mr-3" />
        Share Video
      </Button>
    </div>
  );
};
