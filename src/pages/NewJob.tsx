
import { Breadcrumb } from '@/components/Breadcrumb';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { NewJobHeader } from '@/components/NewJobHeader';
import { NewJobForm } from '@/components/NewJobForm';
import { useNewJob } from '@/hooks/useNewJob';

const NewJob = () => {
  const { propertyUrl, setPropertyUrl, isSubmitting, handleSubmit } = useNewJob();

  return (
    <div className="min-h-screen bg-gray-50">
      <NewJobHeader />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'New Project' }
        ]} />

        <ProgressIndicator currentStep={1} totalSteps={4} stepLabel="Submit Property URL" />

        <NewJobForm 
          propertyUrl={propertyUrl}
          setPropertyUrl={setPropertyUrl}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
        />
      </main>
    </div>
  );
};

export default NewJob;
