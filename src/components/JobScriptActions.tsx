
import { Button } from '@/components/ui/button';

interface JobScriptActionsProps {
  onSave: () => void;
  onApproveAndGenerate: () => void;
  saving: boolean;
  hasScript: boolean;
}

export const JobScriptActions = ({ 
  onSave, 
  onApproveAndGenerate, 
  saving, 
  hasScript 
}: JobScriptActionsProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Button 
        variant="outline" 
        onClick={onSave} 
        disabled={saving}
        className="sm:w-auto"
      >
        {saving ? 'Saving...' : 'Save Script'}
      </Button>
      <Button 
        onClick={onApproveAndGenerate} 
        className="flex-1 sm:flex-none sm:px-8"
        disabled={!hasScript}
      >
        Approve & Generate Video
      </Button>
    </div>
  );
};
