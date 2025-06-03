
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { ArrowLeft, Mail } from 'lucide-react';

interface OTPLoginFormProps {
  onBackToOptions: () => void;
}

export const OTPLoginForm = ({ onBackToOptions }: OTPLoginFormProps) => {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const { signInWithMagicLink } = useAuth();
  const { toast } = useToast();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const { error } = await signInWithMagicLink(email);
      
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setStep('otp');
        toast({
          title: "OTP sent!",
          description: "Check your email for the verification code.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send OTP code",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) return;

    // For now, show success message since OTP verification would need additional setup
    toast({
      title: "Feature coming soon",
      description: "OTP verification will be available in the next update. Please use the magic link from your email.",
    });
  };

  if (step === 'otp') {
    return (
      <div className="space-y-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setStep('email')}
          className="self-start p-0 h-auto"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        
        <div className="text-center">
          <Mail className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Enter verification code</h2>
          <p className="text-sm text-gray-600 mb-6">
            We sent a 6-digit code to <strong>{email}</strong>
          </p>
        </div>

        <form onSubmit={handleVerifyOTP} className="space-y-4">
          <div className="flex justify-center">
            <InputOTP value={otp} onChange={setOtp} maxLength={6}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <Button type="submit" className="w-full" disabled={otp.length !== 6}>
            Verify Code
          </Button>

          <div className="text-center">
            <Button
              variant="link"
              size="sm"
              onClick={handleSendOTP}
              disabled={loading}
            >
              Didn't receive the code? Resend
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={onBackToOptions}
        className="self-start p-0 h-auto"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to login options
      </Button>

      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold mb-2">Sign in with OTP</h2>
        <p className="text-sm text-gray-600">
          Enter your email to receive a verification code
        </p>
      </div>

      <form onSubmit={handleSendOTP} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading || !email}>
          {loading ? "Sending..." : "Send verification code"}
        </Button>
      </form>
    </div>
  );
};
