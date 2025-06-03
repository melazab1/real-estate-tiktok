
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { OTPLoginForm } from '@/components/auth/OTPLoginForm';
import { PasswordLoginForm } from '@/components/auth/PasswordLoginForm';
import { Video, Mail, Lock, ArrowRight } from 'lucide-react';

type AuthMode = 'options' | 'otp' | 'password';

export const AuthNew = () => {
  const [mode, setMode] = useState<AuthMode>('options');
  const { user, loading } = useAuth();

  // Redirect if already authenticated
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

  const renderAuthOptions = () => (
    <div className="space-y-4">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Video className="h-8 w-8 text-blue-600 mr-2" />
          <span className="text-2xl font-bold">VideoGen</span>
        </div>
        <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
        <p className="text-gray-600">Choose how you'd like to sign in</p>
      </div>

      <div className="space-y-3">
        <Button
          variant="outline"
          size="lg"
          className="w-full justify-start h-14"
          onClick={() => setMode('otp')}
        >
          <div className="flex items-center">
            <div className="bg-blue-100 p-2 rounded-lg mr-4">
              <Mail className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-left">
              <div className="font-medium">Continue with OTP</div>
              <div className="text-sm text-gray-500">Get a verification code via email</div>
            </div>
            <ArrowRight className="h-4 w-4 ml-auto text-gray-400" />
          </div>
        </Button>

        <Button
          variant="outline"
          size="lg"
          className="w-full justify-start h-14"
          onClick={() => setMode('password')}
        >
          <div className="flex items-center">
            <div className="bg-green-100 p-2 rounded-lg mr-4">
              <Lock className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-left">
              <div className="font-medium">Continue with Password</div>
              <div className="text-sm text-gray-500">Sign in with email and password</div>
            </div>
            <ArrowRight className="h-4 w-4 ml-auto text-gray-400" />
          </div>
        </Button>
      </div>

      <div className="text-center pt-6 border-t">
        <p className="text-sm text-gray-500">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="pb-4">
          {mode !== 'options' && (
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Video className="h-6 w-6 text-blue-600 mr-2" />
                <span className="text-lg font-bold">VideoGen</span>
              </div>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {mode === 'options' && renderAuthOptions()}
          {mode === 'otp' && <OTPLoginForm onBackToOptions={() => setMode('options')} />}
          {mode === 'password' && <PasswordLoginForm onBackToOptions={() => setMode('options')} />}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthNew;
