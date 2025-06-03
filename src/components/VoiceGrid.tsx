
import { VoiceCard } from './VoiceCard';
import { Mic } from 'lucide-react';
import type { Voice } from '@/hooks/useVoiceData';

interface VoiceGridProps {
  voices: Voice[];
  selectedVoiceId: string;
  onVoiceChange: (voiceId: string) => void;
}

export const VoiceGrid = ({ voices, selectedVoiceId, onVoiceChange }: VoiceGridProps) => {
  if (voices.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Mic className="h-12 w-12 mx-auto mb-2 opacity-50" />
        <p>No voices available for the selected options</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {voices.map(voice => (
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
  );
};
