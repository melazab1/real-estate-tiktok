
import { useToast } from '@/hooks/use-toast';
import { useCallback } from 'react';

interface ErrorOptions {
  title?: string;
  fallbackMessage?: string;
  logError?: boolean;
}

export const useErrorHandler = () => {
  const { toast } = useToast();

  const handleError = useCallback((
    error: any,
    options: ErrorOptions = {}
  ) => {
    const {
      title = "Error",
      fallbackMessage = "An unexpected error occurred",
      logError = true
    } = options;

    if (logError) {
      console.error('Error caught by error handler:', error);
    }

    let message = fallbackMessage;

    // Handle different error types
    if (error?.message) {
      message = error.message;
    } else if (typeof error === 'string') {
      message = error;
    } else if (error?.error?.message) {
      message = error.error.message;
    }

    // Handle specific Supabase errors
    if (error?.code) {
      switch (error.code) {
        case 'PGRST116':
          message = "No data found";
          break;
        case '23505':
          message = "This record already exists";
          break;
        case '23503':
          message = "Referenced record not found";
          break;
        case '42501':
          message = "You don't have permission to perform this action";
          break;
        default:
          message = error.message || fallbackMessage;
      }
    }

    toast({
      title,
      description: message,
      variant: "destructive",
    });

    return message;
  }, [toast]);

  const handleSuccess = useCallback((
    message: string,
    title: string = "Success"
  ) => {
    toast({
      title,
      description: message,
    });
  }, [toast]);

  return {
    handleError,
    handleSuccess
  };
};
