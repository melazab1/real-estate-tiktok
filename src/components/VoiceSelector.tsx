
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VoiceCard } from './VoiceCard';
import { Mic } from 'lucide-react';

interface Voice {
  id: string;
  name: string;
  gender: string;
  language: string;
  accent?: string;
}

interface VoiceSelectorProps {
  selectedLanguage: string;
  selectedAccent: string;
  selectedVoiceId: string;
  onLanguageChange: (language: string) => void;
  onAccentChange: (accent: string) => void;
  onVoiceChange: (voiceId: string) => void;
}

const VOICES: Voice[] = [
  // English voices
  { id: 'en-us-female-1', name: 'Emma', gender: 'Female', language: 'English', accent: 'US' },
  { id: 'en-us-male-1', name: 'David', gender: 'Male', language: 'English', accent: 'US' },
  { id: 'en-uk-female-1', name: 'Charlotte', gender: 'Female', language: 'English', accent: 'UK' },
  { id: 'en-uk-male-1', name: 'James', gender: 'Male', language: 'English', accent: 'UK' },
  { id: 'en-au-female-1', name: 'Olivia', gender: 'Female', language: 'English', accent: 'Australian' },
  { id: 'en-au-male-1', name: 'William', gender: 'Male', language: 'English', accent: 'Australian' },
  
  // Spanish voices
  { id: 'es-female-1', name: 'Sofia', gender: 'Female', language: 'Spanish' },
  { id: 'es-male-1', name: 'Carlos', gender: 'Male', language: 'Spanish' },
  
  // French voices
  { id: 'fr-female-1', name: 'Marie', gender: 'Female', language: 'French' },
  { id: 'fr-male-1', name: 'Pierre', gender: 'Male', language: 'French' },
  
  // Arabic voices
  { id: 'ar-female-1', name: 'Layla', gender: 'Female', language: 'Arabic' },
  { id: 'ar-male-1', name: 'Ahmed', gender: 'Male', language: 'Arabic' },
];

const LANGUAGES = ['English', 'Spanish', 'French', 'Arabic'];
const ACCENTS = ['US', 'UK', 'Australian', 'Canadian'];

export const VoiceSelector = ({
  selectedLanguage,
  selectedAccent,
  selectedVoiceId,
  onLanguageChange,
  onAccentChange,
  onVoiceChange
}: VoiceSelectorProps) => {
  const isEnglish = selectedLanguage === 'English';
  
  const filteredVoices = VOICES.filter(voice => {
    if (voice.language !== selectedLanguage) return false;
    if (isEnglish && voice.accent !== selectedAccent) return false;
    return true;
  });

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Language</label>
            <Select value={selectedLanguage} onValueChange={onLanguageChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map(lang => (
                  <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Show accent dropdown only for English */}
          {isEnglish ? (
            <div>
              <label className="block text-sm font-medium mb-2">Accent</label>
              <Select value={selectedAccent} onValueChange={onAccentChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select accent" />
                </SelectTrigger>
                <SelectContent>
                  {ACCENTS.map(accent => (
                    <SelectItem key={accent} value={accent}>{accent}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium mb-2">Language Variant</label>
              <div className="h-10 px-3 py-2 border rounded-md bg-gray-50 flex items-center text-sm text-gray-700">
                {selectedLanguage} (Standard)
              </div>
            </div>
          )}
        </div>

        {/* Voice Selection Cards */}
        <div>
          <label className="block text-sm font-medium mb-3">Select Voice</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredVoices.map(voice => (
              <VoiceCard
                key={voice.id}
                voiceId={voice.id}
                name={voice.name}
                gender={voice.gender}
                language={voice.language}
                accent={voice.accent}
                isSelected={selectedVoiceId === voice.id}
                onSelect={onVoiceChange}
              />
            ))}
          </div>
        </div>
        
        {filteredVoices.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Mic className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No voices available for the selected options</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
