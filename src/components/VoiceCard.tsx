
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Speaker } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VoiceCardProps {
  voiceId: string;
  name: string;
  gender: string;
  language: string;
  accent?: string;
  isSelected: boolean;
  onSelect: (voiceId: string) => void;
}

export const VoiceCard = ({ 
  voiceId, 
  name, 
  gender, 
  language, 
  accent,
  isSelected, 
  onSelect 
}: VoiceCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const playVoicePreview = async () => {
    setIsPlaying(true);
    
    try {
      // Sample text for voice preview
      const sampleText = "Welcome to this beautiful property located in a prime neighborhood with excellent amenities.";
      
      // Use Web Speech API for voice preview
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(sampleText);
        
        // Try to match voice based on language and characteristics
        const voices = speechSynthesis.getVoices();
        const matchingVoice = voices.find(voice => 
          voice.lang.toLowerCase().includes(language.toLowerCase()) &&
          (gender === 'female' ? voice.name.toLowerCase().includes('female') : voice.name.toLowerCase().includes('male'))
        );
        
        if (matchingVoice) {
          utterance.voice = matchingVoice;
        }
        
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);
        
        speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error('Error playing voice preview:', error);
      setIsPlaying(false);
    }
  };

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all hover:shadow-md border-2",
        isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
      )}
      onClick={() => onSelect(voiceId)}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-gray-900">{name}</h3>
            <div className="flex flex-col gap-1 mt-1">
              <span className="text-sm text-gray-600">{gender} • {language}</span>
              {accent && <span className="text-xs text-gray-500">{accent} accent</span>}
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              playVoicePreview();
            }}
            disabled={isPlaying}
            className={cn(
              "h-8 w-8 p-0",
              isPlaying && "bg-blue-100 border-blue-300"
            )}
          >
            <Speaker className={cn(
              "h-4 w-4",
              isPlaying ? "text-blue-600 animate-pulse" : "text-gray-600"
            )} />
          </Button>
        </div>
        
        {isSelected && (
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            Selected
          </div>
        )}
      </CardContent>
    </Card>
  );
};
