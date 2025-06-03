
import { useNavigate } from 'react-router-dom';
import { Breadcrumb } from '@/components/Breadcrumb';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { VideoSection } from '@/components/VideoSection';
import { VideoSidebar } from '@/components/VideoSidebar';
import { JobResultActions } from '@/components/JobResultActions';
import type { Video as VideoType } from '@/types/job';

interface JobResultContentProps {
  video: VideoType;
  displayId: string;
}

export const JobResultContent = ({ video, displayId }: JobResultContentProps) => {
  const navigate = useNavigate();

  const createAnother = () => {
    navigate('/new-job');
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'New Video', href: '/new-job' },
        { label: 'Review Data', href: `/job/${displayId}/review` },
        { label: 'Script & Voice', href: `/job/${displayId}/script` },
        { label: 'Video Result' }
      ]} />

      <ProgressIndicator currentStep={4} totalSteps={4} stepLabel="Your Video is Ready!" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <VideoSection video={video} />
        <VideoSidebar video={video} />
      </div>

      <div className="mt-8">
        <JobResultActions 
          video={video} 
          displayId={displayId}
          onEditScript={() => navigate(`/job/${displayId}/script`)}
          onCreateAnother={createAnother}
        />
      </div>
    </main>
  );
};
