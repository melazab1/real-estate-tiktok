
import { Button } from '@/components/ui/button';

interface JobReviewActionsProps {
  saving: boolean;
  onSaveChanges: () => void;
  onGenerateScript: () => void;
}

export const JobReviewActions = ({ 
  saving, 
  onSaveChanges, 
  onGenerateScript 
}: JobReviewActionsProps) => {
  return (
    <div className="flex gap-4">
      <Button variant="outline" onClick={onSaveChanges} disabled={saving}>
        {saving ? 'Saving...' : 'Save Changes'}
      </Button>
      <Button onClick={onGenerateScript} className="flex-1">
        Generate Script
      </Button>
    </div>
  );
};
