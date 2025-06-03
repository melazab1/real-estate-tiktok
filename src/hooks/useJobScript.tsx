
import { useScriptState } from './useScriptState';
import { useScriptActions } from './useScriptActions';

export const useJobScript = (jobId: string | undefined) => {
  const { loading, script, updateScript, refetchScript } = useScriptState(jobId);
  const { saving, saveScript, approveAndGenerate } = useScriptActions(jobId, script);

  const handleSaveScript = () => saveScript(refetchScript);

  return {
    loading,
    saving,
    script,
    updateScript,
    saveScript: handleSaveScript,
    approveAndGenerate
  };
};
