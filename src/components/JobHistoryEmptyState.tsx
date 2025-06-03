
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Video } from 'lucide-react';

interface JobHistoryEmptyStateProps {
  totalJobs: number;
}

export const JobHistoryEmptyState = ({ totalJobs }: JobHistoryEmptyStateProps) => {
  return (
    <div className="text-center py-8">
      <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
      <p className="text-gray-500 mb-4">
        {totalJobs === 0 
          ? "Start by creating your first video generation job."
          : "Try adjusting your search or filter criteria."
        }
      </p>
      <Button asChild>
        <Link to="/new-job">Create New Job</Link>
      </Button>
    </div>
  );
};
