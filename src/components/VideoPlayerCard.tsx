
import { Video, Play } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardTitle className="flex items-center text-2xl">
          <Video className="h-6 w-6 mr-3 text-blue-600" />
          Professional Property Video
        </CardTitle>
        <CardDescription className="text-lg">
          {video.status === 'processing' 
            ? 'Your video is being generated with AI...' 
            : 'Your stunning real estate video is ready to share!'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {video.status === 'processing' ? (
          <div className="flex items-center justify-center py-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
            <div className="text-center">
              <div className="relative mb-6">
                <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-600 border-t-transparent mx-auto"></div>
                <Video className="h-8 w-8 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Creating Your Video</h3>
              <p className="text-gray-600 max-w-md">Our AI is crafting a professional property video with your content. This usually takes 2-3 minutes...</p>
              <div className="mt-4 bg-blue-50 rounded-lg p-3 inline-block">
                <p className="text-blue-800 text-sm font-medium">Processing: Combining images, script, and voiceover</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative bg-black rounded-xl overflow-hidden shadow-2xl">
            {video.thumbnail_url ? (
              <div className="relative">
                <img 
                  src={video.thumbnail_url} 
                  alt="Video thumbnail" 
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center group hover:bg-opacity-30 transition-all duration-300">
                  <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-6 group-hover:scale-110 transition-transform duration-300">
                    <Play className="h-12 w-12 text-white" />
                  </div>
                </div>
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
        )}
      </CardContent>
    </Card>
  );
};
