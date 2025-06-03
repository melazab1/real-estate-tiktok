
import { Breadcrumb } from '@/components/Breadcrumb';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { PropertyInfoCard } from '@/components/PropertyInfoCard';
import { PropertyImagesGallery } from '@/components/PropertyImagesGallery';
import { AdditionalInfoCard } from '@/components/AdditionalInfoCard';
import { JobReviewActions } from '@/components/JobReviewActions';
import { Navigation } from '@/components/Navigation';
import { RouteGuard } from '@/components/RouteGuard';
import { useJobReview } from '@/hooks/useJobReview';

const JobReview = () => {
  const {
    loading,
    saving,
    job,
    property,
    images,
    updateProperty,
    toggleVisibility,
    handleImageVisibilityChange,
    handleImagesUpload,
    saveChanges,
    generateScript
  } = useJobReview();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!job || !property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Not Found</h2>
          <p className="text-gray-600">The requested job could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <RouteGuard job={job} currentStep="review">
      <div className="min-h-screen bg-gray-50">
        <Navigation />

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb items={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'New Project', href: '/new-job' },
            { label: 'Review Data' }
          ]} />

          <ProgressIndicator currentStep={2} totalSteps={4} stepLabel="Review & Edit Property Data" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <PropertyInfoCard 
              property={property}
              onUpdateProperty={updateProperty}
              onToggleVisibility={toggleVisibility}
            />

            <PropertyImagesGallery 
              images={images}
              onImageVisibilityChange={handleImageVisibilityChange}
              onImagesUpload={handleImagesUpload}
            />
          </div>

          <div className="mb-8">
            <AdditionalInfoCard 
              property={property}
              onUpdateProperty={updateProperty}
            />
          </div>

          <JobReviewActions 
            saving={saving}
            onSaveChanges={saveChanges}
            onGenerateScript={generateScript}
          />
        </main>
      </div>
    </RouteGuard>
  );
};

export default JobReview;
