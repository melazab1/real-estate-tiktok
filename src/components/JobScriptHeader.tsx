
import { Video } from 'lucide-react';

export const JobScriptHeader = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Video className="h-8 w-8 text-blue-600 mr-2" />
            <span className="text-xl font-bold">VideoGen</span>
          </div>
        </div>
      </div>
    </header>
  );
};
