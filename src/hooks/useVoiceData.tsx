
import { useMemo } from 'react';

interface Voice {
  id: string;
  name: string;
  gender: string;
  language: string;
  accent?: string;
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

export const useVoiceData = (selectedLanguage: string, selectedAccent: string) => {
  const filteredVoices = useMemo(() => {
    const isEnglish = selectedLanguage === 'English';
    
    return VOICES.filter(voice => {
      if (voice.language !== selectedLanguage) return false;
      if (isEnglish && voice.accent !== selectedAccent) return false;
      return true;
    });
  }, [selectedLanguage, selectedAccent]);

  return {
    voices: VOICES,
    filteredVoices,
    languages: LANGUAGES,
    accents: ACCENTS,
    isEnglish: selectedLanguage === 'English'
  };
};

export type { Voice };
