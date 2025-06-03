
import { Video, Play, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { Video as VideoType } from '@/types/job';

interface VideoPlayerCardProps {
  video: VideoType;
}

export const VideoPlayerCard = ({ video }: VideoPlayerCardProps) => {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (video.status === 'processing') {
    return (
      <div className="text-center py-12">
        <div className="relative mb-6">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <Video className="h-8 w-8 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Creating Your Video</h3>
        <p className="text-gray-600 max-w-md mx-auto">Our AI is crafting a professional property video with your content. This usually takes 2-3 minutes...</p>
        <div className="mt-4 bg-blue-50 rounded-lg p-3 inline-block">
          <p className="text-blue-800 text-sm font-medium">Processing: Combining images, script, and voiceover</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center">
      {/* Header with checkmark and title */}
      <div className="mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Video is Ready!</h1>
        <p className="text-gray-600 text-lg">Your professional TikTok video has been generated successfully. Download it now and start sharing!</p>
      </div>

      {/* Generated Video Card */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Video className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold">Generated Video</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">Stunning 3BR Condo in Downtown Seattle</p>
          
          {/* Video Player */}
          <div className="relative bg-black rounded-xl overflow-hidden shadow-2xl">
            {video.video_url ? (
              <div className="relative">
                <video
                  className="w-full h-80 object-cover"
                  poster={video.thumbnail_url || undefined}
                  controls
                  preload="metadata"
                >
                  <source src={video.video_url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                {!video.thumbnail_url && (
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-6">
                      <Play className="h-12 w-12 text-white" />
                    </div>
                  </div>
                )}
                <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
                  HD Quality • {video.duration ? formatDuration(video.duration) : 'N/A'}
                </div>
              </div>
            ) : (
              <div className="w-full h-80 bg-gray-800 flex items-center justify-center">
                <Video className="h-16 w-16 text-white opacity-50" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
