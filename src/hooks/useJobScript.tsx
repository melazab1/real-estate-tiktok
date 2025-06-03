
import { useScriptState } from './useScriptState';
import { useScriptActions } from './useScriptActions';

export const useJobScript = (displayId: string | undefined) => {
  const { loading, script, updateScript, refetchScript } = useScriptState(displayId);
  const { saving, saveScript, approveAndGenerate } = useScriptActions(displayId, script);

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
