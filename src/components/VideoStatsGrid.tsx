
import { Clock, HardDrive, Video } from 'lucide-react';
import type { Video as VideoType } from '@/types/job';

interface VideoStatsGridProps {
  video: VideoType;
}

export const VideoStatsGrid = ({ video }: VideoStatsGridProps) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (video.status === 'processing') {
    return null;
  }

  return (
    <div className="grid grid-cols-3 gap-6 text-center bg-gray-50 rounded-lg p-6">
      <div className="flex flex-col items-center space-y-2">
        <Clock className="h-6 w-6 text-blue-600" />
        <span className="text-sm font-medium text-gray-900">Duration</span>
        <span className="text-lg font-bold text-blue-600">
          {video.duration ? formatDuration(video.duration) : 'N/A'}
        </span>
      </div>
      <div className="flex flex-col items-center space-y-2">
        <HardDrive className="h-6 w-6 text-green-600" />
        <span className="text-sm font-medium text-gray-900">File Size</span>
        <span className="text-lg font-bold text-green-600">
          {video.file_size ? formatFileSize(video.file_size) : 'N/A'}
        </span>
      </div>
      <div className="flex flex-col items-center space-y-2">
        <Video className="h-6 w-6 text-purple-600" />
        <span className="text-sm font-medium text-gray-900">Quality</span>
        <span className="text-lg font-bold text-purple-600">1080p HD</span>
      </div>
    </div>
  );
};
