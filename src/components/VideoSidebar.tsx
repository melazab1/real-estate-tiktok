
import { VideoDownloadSection } from '@/components/VideoDownloadSection';
import { VideoShareSection } from '@/components/VideoShareSection';
import { WhatsNextSection } from '@/components/WhatsNextSection';
import type { Video as VideoType } from '@/types/job';

interface VideoSidebarProps {
  video: VideoType;
}

export const VideoSidebar = ({ video }: VideoSidebarProps) => {
  return (
    <div className="space-y-6">
      <VideoDownloadSection video={video} />
      <VideoShareSection video={video} />
      <WhatsNextSection />
    </div>
  );
};
