
import type { Video as VideoType } from '@/types/job';

interface VideoMetadataProps {
  video: VideoType;
}

export const VideoMetadata = ({ video }: VideoMetadataProps) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (video.status !== 'completed') {
    return null;
  }

  return (
    <div className="grid grid-cols-4 gap-6 text-center bg-gray-50 rounded-lg p-6">
      <div>
        <div className="text-sm font-medium text-gray-600 mb-1">Duration</div>
        <div className="text-lg font-bold text-gray-900">
          {video.duration ? formatDuration(video.duration) : '0:30'}
        </div>
      </div>
      <div>
        <div className="text-sm font-medium text-gray-600 mb-1">File Size</div>
        <div className="text-lg font-bold text-gray-900">
          {video.file_size ? formatFileSize(video.file_size) : '12.4 MB'}
        </div>
      </div>
      <div>
        <div className="text-sm font-medium text-gray-600 mb-1">Resolution</div>
        <div className="text-lg font-bold text-gray-900">1080x1920</div>
      </div>
      <div>
        <div className="text-sm font-medium text-gray-600 mb-1">Format</div>
        <div className="text-lg font-bold text-gray-900">MP4</div>
      </div>
    </div>
  );
};
