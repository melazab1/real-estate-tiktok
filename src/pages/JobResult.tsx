
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Breadcrumb } from '@/components/Breadcrumb';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { Navigation } from '@/components/Navigation';
import { RouteGuard } from '@/components/RouteGuard';
import { VideoPlayerCard } from '@/components/VideoPlayerCard';
import { VideoMetadata } from '@/components/VideoMetadata';
import { VideoDownloadSection } from '@/components/VideoDownloadSection';
import { VideoShareSection } from '@/components/VideoShareSection';
import { WhatsNextSection } from '@/components/WhatsNextSection';
import { JobResultActions } from '@/components/JobResultActions';
import { toast } from '@/hooks/use-toast';
import type { Video as VideoType, Job } from '@/types/job';

const JobResult = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [video, setVideo] = useState<VideoType | null>(null);
  const [job, setJob] = useState<Job | null>(null);

  useEffect(() => {
    if (jobId) {
      fetchVideoData();
    }
  }, [jobId]);

  const fetchVideoData = async () => {
    try {
      const { data: jobData, error: jobError } = await supabase
        .from('jobs')
        .select('*')
        .eq('job_id', jobId)
        .single();

      if (jobError) throw jobError;
      setJob(jobData);

      const { data: videoData, error: videoError } = await supabase
        .from('videos')
        .select('*')
        .eq('job_id', jobId)
        .maybeSingle();

      if (!videoError && videoData) {
        setVideo(videoData);
      } else {
        // Simulate video processing
        const mockVideo: VideoType = {
          id: crypto.randomUUID(),
          job_id: jobId!,
          video_url: null,
          thumbnail_url: null,
          status: 'processing',
          duration: null,
          file_size: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setVideo(mockVideo);

        // Simulate completion after 5 seconds
        setTimeout(() => {
          setVideo({
            ...mockVideo,
            status: 'completed',
            video_url: 'https://example.com/sample-video.mp4',
            thumbnail_url: 'https://via.placeholder.com/640x360/4f46e5/ffffff?text=Property+Video',
            duration: 30,
            file_size: 13000000
          });
        }, 5000);
      }
    } catch (error) {
      console.error('Error fetching video data:', error);
      toast({ title: "Error", description: "Failed to load video data", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const createAnother = () => {
    navigate('/new-job');
  };

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

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb items={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'New Video', href: '/new-job' },
            { label: 'Review Data', href: `/job/${jobId}/review` },
            { label: 'Script & Voice', href: `/job/${jobId}/script` },
            { label: 'Video Result' }
          ]} />

          <ProgressIndicator currentStep={4} totalSteps={4} stepLabel="Your Video is Ready!" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Video Player */}
            <div className="lg:col-span-2">
              <VideoPlayerCard video={video} />
              <div className="mt-6">
                <VideoMetadata video={video} />
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              <VideoDownloadSection video={video} />
              <VideoShareSection video={video} />
              <WhatsNextSection />
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="mt-8">
            <JobResultActions 
              video={video} 
              jobId={jobId!}
              onEditScript={() => navigate(`/job/${jobId}/script`)}
              onCreateAnother={createAnother}
            />
          </div>
        </main>
      </div>
    </RouteGuard>
  );
};

export default JobResult;
