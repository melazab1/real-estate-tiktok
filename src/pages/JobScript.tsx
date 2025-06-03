
import { useParams } from 'react-router-dom';
import { Breadcrumb } from '@/components/Breadcrumb';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { ScriptEditor } from '@/components/ScriptEditor';
import { VoiceSelector } from '@/components/VoiceSelector';
import { JobScriptHeader } from '@/components/JobScriptHeader';
import { JobScriptActions } from '@/components/JobScriptActions';
import { JobScriptLoading } from '@/components/JobScriptLoading';
import { JobScriptError } from '@/components/JobScriptError';
import { useJobScript } from '@/hooks/useJobScript';

const JobScript = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const {
    loading,
    saving,
    script,
    updateScript,
    saveScript,
    approveAndGenerate
  } = useJobScript(jobId);

  if (loading) {
    return <JobScriptLoading />;
  }

  if (!script) {
    return <JobScriptError />;
  }

  const handleLanguageChange = (language: string) => {
    updateScript('language', language);
    // Reset accent to US when changing to English, or clear it for other languages
    if (language === 'English') {
      updateScript('accent', 'US');
      updateScript('voice_id', 'en-us-female-1');
    } else {
      updateScript('accent', null);
      // Set first available voice for the new language
      const languageCode = language.toLowerCase().substring(0, 2);
      updateScript('voice_id', `${languageCode}-female-1`);
    }
  };

  const handleAccentChange = (accent: string) => {
    updateScript('accent', accent);
    // Update voice to match new accent
    const accentCode = accent.toLowerCase() === 'uk' ? 'uk' : 
                      accent.toLowerCase() === 'australian' ? 'au' : 'us';
    updateScript('voice_id', `en-${accentCode}-female-1`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <JobScriptHeader />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'New Project', href: '/new-job' },
          { label: 'Review Data', href: `/job/${jobId}/review` },
          { label: 'Script & Voice' }
        ]} />

        <ProgressIndicator currentStep={3} totalSteps={4} stepLabel="Review Script & Select Voice" />

        <div className="space-y-8">
          {/* Script Editor */}
          <ScriptEditor
            script={script.script_text || ''}
            onScriptChange={(newScript) => updateScript('script_text', newScript)}
            onSave={saveScript}
          />

          {/* Voice Selector */}
          <VoiceSelector
            selectedLanguage={script.language || 'English'}
            selectedAccent={script.accent || 'US'}
            selectedVoiceId={script.voice_id || 'en-us-female-1'}
            onLanguageChange={handleLanguageChange}
            onAccentChange={handleAccentChange}
            onVoiceChange={(voiceId) => updateScript('voice_id', voiceId)}
          />

          {/* Action Buttons */}
          <JobScriptActions
            onSave={saveScript}
            onApproveAndGenerate={approveAndGenerate}
            saving={saving}
            hasScript={!!script.script_text?.trim()}
          />
        </div>
      </main>
    </div>
  );
};

export default JobScript;
