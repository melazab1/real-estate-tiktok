
import { VideoPlayerCard } from '@/components/VideoPlayerCard';
import { VideoMetadata } from '@/components/VideoMetadata';
import type { Video as VideoType } from '@/types/job';

interface VideoSectionProps {
  video: VideoType;
}

export const VideoSection = ({ video }: VideoSectionProps) => {
  return (
    <div className="lg:col-span-2">
      <VideoPlayerCard video={video} />
      <div className="mt-6">
        <VideoMetadata video={video} />
      </div>
    </div>
  );
};
