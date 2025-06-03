
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface VoiceFiltersProps {
  selectedLanguage: string;
  selectedAccent: string;
  languages: string[];
  accents: string[];
  isEnglish: boolean;
  onLanguageChange: (language: string) => void;
  onAccentChange: (accent: string) => void;
}

export const VoiceFilters = ({
  selectedLanguage,
  selectedAccent,
  languages,
  accents,
  isEnglish,
  onLanguageChange,
  onAccentChange
}: VoiceFiltersProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium mb-2">Language</label>
        <Select value={selectedLanguage} onValueChange={onLanguageChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {languages.map(lang => (
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
              {accents.map(accent => (
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
  );
};
