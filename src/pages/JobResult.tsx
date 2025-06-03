
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumb } from '@/components/Breadcrumb';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { Video, Download, RotateCcw, Clock, HardDrive } from 'lucide-react';
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
            duration: 120,
            file_size: 25600000
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

  const downloadVideo = () => {
    if (video?.video_url) {
      window.open(video.video_url, '_blank');
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Video className="h-8 w-8 text-blue-600 mr-2" />
              <span className="text-xl font-bold">VideoGen</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'New Project', href: '/new-job' },
          { label: 'Review Data', href: `/job/${jobId}/review` },
          { label: 'Script & Voice', href: `/job/${jobId}/script` },
          { label: 'Video Result' }
        ]} />

        <ProgressIndicator currentStep={4} totalSteps={4} stepLabel="Your Video is Ready!" />

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Video className="h-5 w-5 mr-2" />
                Property Video
              </CardTitle>
              <CardDescription>
                {video.status === 'processing' 
                  ? 'Your video is being generated...' 
                  : 'Your professional real estate video is ready!'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {video.status === 'processing' ? (
                <div className="flex items-center justify-center py-16 bg-gray-100 rounded-lg">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <h3 className="text-lg font-semibold mb-2">Generating Your Video</h3>
                    <p className="text-gray-600">This usually takes 2-3 minutes...</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative bg-black rounded-lg overflow-hidden">
                    {video.thumbnail_url ? (
                      <img 
                        src={video.thumbnail_url} 
                        alt="Video thumbnail" 
                        className="w-full h-64 object-cover"
                      />
                    ) : (
                      <div className="w-full h-64 bg-gray-800 flex items-center justify-center">
                        <Video className="h-16 w-16 text-white opacity-50" />
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-blue-600 bg-opacity-80 rounded-full p-4">
                        <Video className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">
                        {video.duration ? formatDuration(video.duration) : 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <HardDrive className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">
                        {video.file_size ? formatFileSize(video.file_size) : 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <Video className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">HD Quality</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {video.status === 'completed' && (
            <div className="flex gap-4">
              <Button onClick={downloadVideo} className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Download Video
              </Button>
              <Button variant="outline" onClick={createAnother}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Create Another Video
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default JobResult;
