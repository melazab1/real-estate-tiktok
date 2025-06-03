
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Video, Zap, Shield, Star, ArrowRight, Mail, Lock } from 'lucide-react';

const Index = () => {
  const { user, loading } = useAuth();

  // Redirect authenticated users to dashboard
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Video className="h-8 w-8 text-blue-600 mr-2" />
              <span className="text-xl font-bold">VideoGen</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" asChild>
                <a href="/auth">Sign In</a>
              </Button>
              <Button asChild>
                <a href="/auth-new">
                  Get Started
                  <ArrowRight className="h-4 w-4 ml-1" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            🔐 New! Secure 6-digit code authentication
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Transform Property Listings into 
            <span className="text-blue-600"> Stunning Videos</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Generate professional real estate videos automatically from any property listing URL. 
            Showcase properties with beautiful visuals and engaging content in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <a href="/auth-new">
                <Video className="h-5 w-5 mr-2" />
                Create Your First Video
              </a>
            </Button>
            <Button size="lg" variant="outline">
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center bg-white rounded-2xl p-8 shadow-lg">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
            <p className="text-gray-600">
              Generate professional videos in minutes, not hours. Just paste a property URL and let AI do the work.
            </p>
          </div>

          <div className="text-center bg-white rounded-2xl p-8 shadow-lg">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Professional Quality</h3>
            <p className="text-gray-600">
              AI-powered video generation creates stunning, professional-grade content that showcases properties beautifully.
            </p>
          </div>

          <div className="text-center bg-white rounded-2xl p-8 shadow-lg">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Easy to Use</h3>
            <p className="text-gray-600">
              No video editing experience required. Simply provide a property listing and get a complete marketing video.
            </p>
          </div>
        </div>

        {/* Auth Options Preview */}
        <div className="mt-20 text-center bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Secure & Simple Authentication
          </h2>
          <p className="text-gray-600 mb-8">
            Choose the authentication method that works best for you
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-8">
            <div className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors">
              <Shield className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">6-Digit Code</h3>
              <p className="text-sm text-gray-600">Secure verification code sent to your email</p>
            </div>
            <div className="border border-gray-200 rounded-xl p-6 hover:border-green-300 transition-colors">
              <Lock className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Email + Password</h3>
              <p className="text-sm text-gray-600">Traditional login with your credentials</p>
            </div>
          </div>
          
          <Button size="lg" asChild>
            <a href="/auth-new">
              Start Creating Videos Today
              <ArrowRight className="h-4 w-4 ml-2" />
            </a>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Index;
