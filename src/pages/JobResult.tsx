import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumb } from '@/components/Breadcrumb';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { Navigation } from '@/components/Navigation';
import { RouteGuard } from '@/components/RouteGuard';
import { Video, Download, RotateCcw, Clock, HardDrive, Share2, Play } from 'lucide-react';
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

  const shareVideo = () => {
    if (video?.video_url) {
      navigator.clipboard.writeText(video.video_url);
      toast({ title: "Success", description: "Video link copied to clipboard" });
    }
  };

  const createAnother = () => {
    navigate('/new-job');
  };

  const editScript = () => {
    navigate(`/job/${jobId}/script`);
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
                  <div className="space-y-6">
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
                  </div>
                )}
              </CardContent>
            </Card>

            {video.status === 'completed' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button onClick={downloadVideo} size="lg" className="h-14 text-lg">
                  <Download className="h-5 w-5 mr-3" />
                  Download Video
                </Button>
                <Button variant="outline" onClick={shareVideo} size="lg" className="h-14 text-lg">
                  <Share2 className="h-5 w-5 mr-3" />
                  Share Video
                </Button>
              </div>
            )}

            {video.status === 'completed' && (
              <div className="flex gap-4">
                <Button variant="outline" onClick={editScript} className="flex-1">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Script
                </Button>
                <Button variant="outline" onClick={createAnother} className="flex-1">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Create Another Video
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </RouteGuard>
  );
};

export default JobResult;
