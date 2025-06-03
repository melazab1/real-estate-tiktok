
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
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="overflow-x-auto">
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
                  {job.job_id}
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
                      <Link to={`/job/${job.job_id}/review`}>
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
  );
};
