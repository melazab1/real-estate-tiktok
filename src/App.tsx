
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import NewJob from "./pages/NewJob";
import JobReview from "./pages/JobReview";
import JobScript from "./pages/JobScript";
import JobResult from "./pages/JobResult";
import JobHistory from "./pages/JobHistory";
import WebhookSettings from "./pages/WebhookSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Don't retry on auth errors
        if (error?.status === 401 || error?.status === 403) {
          return false;
        }
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
    mutations: {
      retry: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ErrorBoundary>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/history" 
                element={
                  <ProtectedRoute>
                    <JobHistory />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/settings/webhooks" 
                element={
                  <ProtectedRoute>
                    <WebhookSettings />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/new-job" 
                element={
                  <ProtectedRoute>
                    <NewJob />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/job/:jobId/review" 
                element={
                  <ProtectedRoute>
                    <JobReview />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/job/:jobId/script" 
                element={
                  <ProtectedRoute>
                    <JobScript />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/job/:jobId/result" 
                element={
                  <ProtectedRoute>
                    <JobResult />
                  </ProtectedRoute>
                } 
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ErrorBoundary>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
