
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { JobHistoryHeader } from '@/components/JobHistoryHeader';
import { JobHistoryFilters } from '@/components/JobHistoryFilters';
import { JobHistoryTable } from '@/components/JobHistoryTable';
import { JobHistoryEmptyState } from '@/components/JobHistoryEmptyState';
import { getJobIdentifier } from '@/utils/routeUtils';
import { Job, Property, Video } from '@/types/job';

export const JobHistory = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (user) {
      fetchJobs();
    }
  }, [user]);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          properties!properties_job_id_fkey (
            id,
            job_id,
            title,
            description,
            price,
            location,
            bedrooms,
            bathrooms,
            area,
            additional_info,
            is_visible,
            created_at,
            updated_at
          ),
          videos!videos_job_id_fkey (
            id,
            job_id,
            video_url,
            thumbnail_url,
            status,
            duration,
            file_size,
            created_at,
            updated_at
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching jobs:', error);
      } else {
        // Transform the data to match our TypeScript interfaces
        const transformedJobs: Job[] = (data || []).map(job => ({
          ...job,
          properties: job.properties?.map((prop: any): Property => ({
            ...prop,
            is_visible: prop.is_visible as Record<string, boolean> || {}
          })) || [],
          videos: job.videos?.map((video: any): Video => ({
            ...video
          })) || []
        }));
        
        setJobs(transformedJobs);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const firstProperty = job.properties?.[0];
    const jobIdentifier = getJobIdentifier(job);
    const matchesSearch = firstProperty?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         firstProperty?.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         jobIdentifier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <JobHistoryHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Job History</h1>
          <p className="text-gray-600 mt-2">View and manage all your video generation jobs</p>
        </div>

        <JobHistoryFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg sm:text-xl">Your Jobs ({filteredJobs.length})</CardTitle>
            <CardDescription>
              {jobs.length === 0 
                ? "No jobs found. Start by creating your first video."
                : `Showing ${filteredJobs.length} of ${jobs.length} jobs`
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredJobs.length === 0 ? (
              <JobHistoryEmptyState totalJobs={jobs.length} />
            ) : (
              <JobHistoryTable jobs={filteredJobs} />
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default JobHistory;
