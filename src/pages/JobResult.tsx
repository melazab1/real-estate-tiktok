
import { Navigation } from '@/components/Navigation';
import { RouteGuard } from '@/components/RouteGuard';
import { JobResultContent } from '@/components/JobResultContent';
import { useJobResult } from '@/hooks/useJobResult';

const JobResult = () => {
  const { loading, video, job } = useJobResult();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!video || !job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Video Not Found</h2>
          <p className="text-gray-600">The requested video could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <RouteGuard job={job} currentStep="result">
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <JobResultContent video={video} displayId={job.display_id} />
      </div>
    </RouteGuard>
  );
};

export default JobResult;
