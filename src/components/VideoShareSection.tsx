
import { Share2, Facebook, Twitter, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import type { Video as VideoType } from '@/types/job';

interface VideoShareSectionProps {
  video: VideoType;
}

export const VideoShareSection = ({ video }: VideoShareSectionProps) => {
  const shareOnFacebook = () => {
    if (video?.video_url) {
      const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(video.video_url)}`;
      window.open(url, '_blank', 'width=600,height=400');
    }
  };

  const shareOnTwitter = () => {
    if (video?.video_url) {
      const text = "Check out this amazing property video!";
      const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(video.video_url)}`;
      window.open(url, '_blank', 'width=600,height=400');
    }
  };

  const shareOnInstagram = () => {
    toast({ 
      title: "Instagram Sharing", 
      description: "Please download the video and upload it manually to Instagram" 
    });
  };

  if (video.status !== 'completed') {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Share2 className="h-5 w-5" />
          Share Your Video
        </CardTitle>
        <p className="text-sm text-gray-600">Share on social media platforms</p>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button variant="outline" onClick={shareOnFacebook} className="w-full justify-start">
          <Facebook className="h-4 w-4 mr-2 text-blue-600" />
          Share on Facebook
        </Button>
        <Button variant="outline" onClick={shareOnTwitter} className="w-full justify-start">
          <Twitter className="h-4 w-4 mr-2 text-blue-400" />
          Share on Twitter
        </Button>
        <Button variant="outline" onClick={shareOnInstagram} className="w-full justify-start">
          <Instagram className="h-4 w-4 mr-2 text-pink-600" />
          Share on Instagram
        </Button>
      </CardContent>
    </Card>
  );
};
