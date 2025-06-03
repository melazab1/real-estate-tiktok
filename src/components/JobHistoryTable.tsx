
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Download, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { Job } from '@/types/job';

interface JobHistoryTableProps {
  jobs: Job[];
}

export const JobHistoryTable = ({ jobs }: JobHistoryTableProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
      case 'generating':
        return 'bg-blue-100 text-blue-800';
      case 'script_ready':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewing':
      case 'analyzing':
        return 'bg-orange-100 text-orange-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getViewRoute = (job: Job) => {
    const jobId = job.display_id || job.job_id;
    switch (job.status) {
      case 'completed':
        return `/job/${jobId}/result`;
      case 'script_ready':
        return `/job/${jobId}/script`;
      case 'reviewing':
      case 'analyzing':
      default:
        return `/job/${jobId}/review`;
    }
  };

  return (
    <div className="w-full">
      {/* Mobile Card Layout */}
      <div className="block sm:hidden space-y-4">
        {jobs.map((job) => {
          const firstProperty = job.properties?.[0];
          const firstVideo = job.videos?.[0];
          
          return (
            <div key={job.id} className="bg-white border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">
                    {firstProperty?.title || 'Untitled Property'}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {firstProperty?.location || 'No location'}
                  </div>
                </div>
                <Badge className={`${getStatusColor(job.status || 'unknown')} text-xs ml-2 flex-shrink-0`}>
                  {job.status}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {job.created_at ? format(new Date(job.created_at), 'MMM dd, yyyy') : 'N/A'}
                </div>
                <div className="font-mono">
                  {job.display_id || job.job_id}
                </div>
              </div>
              
              <div className="flex items-center space-x-2 pt-2">
                <Button variant="outline" size="sm" asChild className="flex-1">
                  <Link to={getViewRoute(job)}>
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Link>
                </Button>
                {firstVideo?.video_url && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={firstVideo.video_url} download>
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </a>
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden sm:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Property</TableHead>
              <TableHead>Job ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job) => {
              const firstProperty = job.properties?.[0];
              const firstVideo = job.videos?.[0];
              
              return (
                <TableRow key={job.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {firstProperty?.title || 'Untitled Property'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {firstProperty?.location || 'No location'}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {job.display_id || job.job_id}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(job.status || 'unknown')}>
                      {job.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {job.created_at ? format(new Date(job.created_at), 'MMM dd, yyyy') : 'N/A'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={getViewRoute(job)}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Link>
                      </Button>
                      {firstVideo?.video_url && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={firstVideo.video_url} download>
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </a>
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
