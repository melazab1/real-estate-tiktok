
import { Breadcrumb } from '@/components/Breadcrumb';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { PropertyInfoCard } from '@/components/PropertyInfoCard';
import { PropertyImagesGallery } from '@/components/PropertyImagesGallery';
import { AdditionalInfoCard } from '@/components/AdditionalInfoCard';
import { JobReviewActions } from '@/components/JobReviewActions';
import { Navigation } from '@/components/Navigation';
import { RouteGuard } from '@/components/RouteGuard';
import { LoadingSpinner } from '@/components/loading/LoadingSpinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useJobReview } from '@/hooks/useJobReview';

const JobReview = () => {
  const {
    loading,
    saving,
    job,
    jobError,
    property,
    propertyLoading,
    images,
    progress,
    detailedStatus,
    hasError,
    errorDetails,
    updateProperty,
    toggleVisibility,
    handleImageVisibilityChange,
    handleImagesUpload,
    saveChanges,
    generateScript
  } = useJobReview();

  // Show loading spinner while initial data is being fetched
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading job data...</p>
          {detailedStatus && (
            <p className="text-sm text-gray-500 mt-2">{detailedStatus}</p>
          )}
        </div>
      </div>
    );
  }

  // Show error if job not found or has errors
  if (jobError || !job || hasError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {hasError ? 'Processing Error' : 'Job Not Found'}
          </h2>
          <p className="text-gray-600">
            {errorDetails || jobError || "The requested job could not be found."}
          </p>
        </div>
      </div>
    );
  }

  // Show property loading state
  if (propertyLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb items={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'New Project', href: '/new-job' },
            { label: 'Review Data' }
          ]} />

          <ProgressIndicator currentStep={2} totalSteps={4} stepLabel="Review & Edit Property Data" />
          
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <LoadingSpinner size={20} className="mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Setting up property data...</h3>
              <p className="text-gray-600">This will only take a moment.</p>
              {detailedStatus && (
                <p className="text-sm text-gray-500 mt-2">{detailedStatus}</p>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Show warning if property is still missing after loading
  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb items={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'New Project', href: '/new-job' },
            { label: 'Review Data' }
          ]} />

          <ProgressIndicator currentStep={2} totalSteps={4} stepLabel="Review & Edit Property Data" />
          
          <Alert className="max-w-2xl mx-auto mt-8">
            <AlertDescription>
              Property data could not be loaded. Please try refreshing the page or contact support if the problem persists.
              {detailedStatus && (
                <div className="mt-2 text-sm">{detailedStatus}</div>
              )}
            </AlertDescription>
          </Alert>
        </main>
      </div>
    );
  }

  // Main content when everything is loaded successfully
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

          {/* Show real-time status if available */}
          {detailedStatus && progress !== undefined && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-800">Status: {detailedStatus}</span>
                <span className="text-sm text-blue-600">{progress}% Complete</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

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
