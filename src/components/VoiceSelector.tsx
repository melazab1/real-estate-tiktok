
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VoiceFilters } from './VoiceFilters';
import { VoiceGrid } from './VoiceGrid';
import { useVoiceData } from '@/hooks/useVoiceData';
import { Mic } from 'lucide-react';

interface VoiceSelectorProps {
  selectedLanguage: string;
  selectedAccent: string;
  selectedVoiceId: string;
  onLanguageChange: (language: string) => void;
  onAccentChange: (accent: string) => void;
  onVoiceChange: (voiceId: string) => void;
}

export const VoiceSelector = ({
  selectedLanguage,
  selectedAccent,
  selectedVoiceId,
  onLanguageChange,
  onAccentChange,
  onVoiceChange
}: VoiceSelectorProps) => {
  const { filteredVoices, languages, accents, isEnglish } = useVoiceData(
    selectedLanguage,
    selectedAccent
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Mic className="h-5 w-5 mr-2" />
          Voice Settings
        </CardTitle>
        <p className="text-sm text-gray-600">
          Choose the voice characteristics for your video narration
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Language and Accent Selection */}
        <VoiceFilters
          selectedLanguage={selectedLanguage}
          selectedAccent={selectedAccent}
          languages={languages}
          accents={accents}
          isEnglish={isEnglish}
          onLanguageChange={onLanguageChange}
          onAccentChange={onAccentChange}
        />

        {/* Voice Selection Cards */}
        <div>
          <label className="block text-sm font-medium mb-3">Select Voice</label>
          <VoiceGrid
            voices={filteredVoices}
            selectedVoiceId={selectedVoiceId}
            onVoiceChange={onVoiceChange}
          />
        </div>
      </CardContent>
    </Card>
  );
};
