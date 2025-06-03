
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Eye } from 'lucide-react';
import { getJobIdentifier } from '@/utils/routeUtils';
import type { Job, Property } from '@/types/job';

export const RecentJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchRecentJobs();
    }
  }, [user]);

  const fetchRecentJobs = async () => {
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
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      
      // Transform the data to match our TypeScript interfaces
      const transformedJobs: Job[] = (data || []).map(job => ({
        ...job,
        properties: job.properties?.map((prop: any): Property => ({
          ...prop,
          is_visible: prop.is_visible as Record<string, boolean> || {}
        })) || []
      }));
      
      setJobs(transformedJobs);
    } catch (error) {
      console.error('Error fetching recent jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'analyzing': return 'bg-yellow-100 text-yellow-800';
      case 'reviewing': return 'bg-blue-100 text-blue-800';
      case 'script_ready': return 'bg-blue-100 text-blue-800';
      case 'generating': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string | null) => {
    switch (status) {
      case 'analyzing': return 'Analyzing';
      case 'reviewing': return 'Ready for Review';
      case 'script_ready': return 'Script Ready';
      case 'generating': return 'Generating';
      case 'completed': return 'Completed';
      default: return 'Unknown';
    }
  };

  const getNextAction = (job: Job) => {
    const jobIdentifier = getJobIdentifier(job);
    switch (job.status) {
      case 'analyzing':
        return { label: 'Review Data', href: `/job/${jobIdentifier}/review` };
      case 'reviewing':
        return { label: 'Review Data', href: `/job/${jobIdentifier}/review` };
      case 'script_ready':
        return { label: 'Edit Script', href: `/job/${jobIdentifier}/script` };
      case 'generating':
        return { label: 'View Progress', href: `/job/${jobIdentifier}/result` };
      case 'completed':
        return { label: 'View Video', href: `/job/${jobIdentifier}/result` };
      default:
        return { label: 'View Details', href: `/job/${jobIdentifier}/review` };
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg sm:text-xl">Recent Projects</CardTitle>
        <CardDescription>Your latest video generation projects</CardDescription>
      </CardHeader>
      <CardContent>
        {jobs.length === 0 ? (
          <p className="text-gray-500 text-center py-8 text-sm">
            No projects yet. Create your first video to get started!
          </p>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => {
              const nextAction = getNextAction(job);
              const firstProperty = job.properties?.[0];
              const jobIdentifier = getJobIdentifier(job);
              
              return (
                <div key={job.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border rounded-lg hover:bg-gray-50 space-y-3 sm:space-y-0">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                      <Badge className={`${getStatusColor(job.status)} text-xs self-start sm:self-auto`}>
                        {getStatusLabel(job.status)}
                      </Badge>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span className="mr-2">{job.created_at ? new Date(job.created_at).toLocaleDateString() : 'N/A'}</span>
                        <span className="font-mono text-xs">
                          {jobIdentifier}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 truncate">
                      {firstProperty?.title || job.property_url || 'Property listing'}
                    </p>
                    {firstProperty?.location && (
                      <p className="text-xs text-gray-500 truncate">
                        {firstProperty.location}
                      </p>
                    )}
                  </div>
                  <Button size="sm" variant="outline" asChild className="w-full sm:w-auto">
                    <Link to={nextAction.href}>
                      <Eye className="h-3 w-3 mr-1" />
                      {nextAction.label}
                    </Link>
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
