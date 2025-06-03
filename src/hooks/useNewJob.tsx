
import { useAuth } from '@/hooks/useAuth';
import { useNewJobForm } from '@/hooks/useNewJobForm';
import { useJobSubmission } from '@/hooks/useJobSubmission';

export const useNewJob = () => {
  const { user } = useAuth();
  const { propertyUrl, setPropertyUrl, validateForm } = useNewJobForm();
  const { isSubmitting, submitJob } = useJobSubmission(user?.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!validateForm()) {
      return;
    }

    await submitJob(propertyUrl);
  };

  return {
    propertyUrl,
    setPropertyUrl,
    isSubmitting,
    handleSubmit
  };
};
