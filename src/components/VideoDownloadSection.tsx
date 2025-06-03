
import { Download, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import type { Video as VideoType } from '@/types/job';

interface VideoDownloadSectionProps {
  video: VideoType;
}

export const VideoDownloadSection = ({ video }: VideoDownloadSectionProps) => {
  const downloadVideo = () => {
    if (video?.video_url) {
      window.open(video.video_url, '_blank');
    }
  };

  const copyVideoLink = () => {
    if (video?.video_url) {
      navigator.clipboard.writeText(video.video_url);
      toast({ title: "Success", description: "Video link copied to clipboard" });
    }
  };

  if (video.status !== 'completed') {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Download className="h-5 w-5" />
          Download Video
        </CardTitle>
        <p className="text-sm text-gray-600">Download your video in high quality</p>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button onClick={downloadVideo} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
          <Download className="h-4 w-4 mr-2" />
          Download HD Video
        </Button>
        <Button variant="outline" onClick={copyVideoLink} className="w-full">
          <Copy className="h-4 w-4 mr-2" />
          Copy Video Link
        </Button>
      </CardContent>
    </Card>
  );
};
