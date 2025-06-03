
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { Video as VideoType, Job } from '@/types/job';

export const useJobResult = () => {
  const { identifier } = useParams<{ identifier: string }>();
  const [loading, setLoading] = useState(true);
  const [video, setVideo] = useState<VideoType | null>(null);
  const [job, setJob] = useState<Job | null>(null);

  useEffect(() => {
    if (identifier) {
      fetchVideoData();
    }
  }, [identifier]);

  const fetchVideoData = async () => {
    try {
      const { data: jobData, error: jobError } = await supabase
        .from('jobs')
        .select('*')
        .eq('display_id', identifier)
        .single();

      if (jobError) throw jobError;
      setJob(jobData);

      const { data: videoData, error: videoError } = await supabase
        .from('videos')
        .select('*')
        .eq('job_id', jobData.id)
        .maybeSingle();

      if (!videoError && videoData) {
        setVideo(videoData);
      } else {
        // Simulate video processing
        const mockVideo: VideoType = {
          id: crypto.randomUUID(),
          job_id: jobData.id,
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

  return {
    identifier,
    loading,
    video,
    job
  };
};
