
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Save, X, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScriptEditorProps {
  script: string;
  onScriptChange: (script: string) => void;
  onSave?: () => void;
}

export const ScriptEditor = ({ script, onScriptChange, onSave }: ScriptEditorProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempScript, setTempScript] = useState(script);

  const handleEdit = () => {
    setTempScript(script);
    setIsEditing(true);
  };

  const handleSave = () => {
    onScriptChange(tempScript);
    setIsEditing(false);
    onSave?.();
  };

  const handleCancel = () => {
    setTempScript(script);
    setIsEditing(false);
  };

  return (
    <Card className={cn(
      "transition-all duration-200",
      isEditing && "ring-2 ring-blue-500 ring-opacity-50"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-lg">
            <FileText className="h-5 w-5 mr-2" />
            Video Script
            {isEditing && <span className="ml-2 text-sm text-blue-600 font-normal">(Editing)</span>}
          </CardTitle>
          
          <div className="flex gap-2">
            {!isEditing ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleEdit}
                className="h-8 px-3"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit Script
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  className="h-8 px-3"
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  className="h-8 px-3"
                >
                  <Save className="h-4 w-4 mr-1" />
                  Save Changes
                </Button>
              </>
            )}
          </div>
        </div>
        
        <p className="text-sm text-gray-600">
          {isEditing 
            ? "Edit your video script and save your changes"
            : "Review the generated script for your video"
          }
        </p>
      </CardHeader>
      
      <CardContent>
        <Textarea
          value={isEditing ? tempScript : script}
          onChange={(e) => setTempScript(e.target.value)}
          readOnly={!isEditing}
          rows={12}
          className={cn(
            "w-full transition-all duration-200",
            !isEditing && "bg-gray-50 cursor-default resize-none",
            isEditing && "bg-white border-blue-200 focus:border-blue-500"
          )}
          placeholder="Enter your video script here..."
        />
        
        {isEditing && (
          <div className="mt-2 text-xs text-gray-500">
            Tip: Keep your script concise and engaging for better video results
          </div>
        )}
      </CardContent>
    </Card>
  );
};
