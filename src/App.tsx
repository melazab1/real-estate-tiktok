
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminRoute } from "@/components/AdminRoute";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import NewJob from "./pages/NewJob";
import JobReview from "./pages/JobReview";
import JobScript from "./pages/JobScript";
import JobResult from "./pages/JobResult";
import JobHistory from "./pages/JobHistory";
import Profile from "./pages/Profile";
import WebhookSettings from "./pages/WebhookSettings";
import NotFound from "./pages/NotFound";
import AuthNew from "./pages/AuthNew";
import SubmissionLoading from "./pages/SubmissionLoading";
import ScriptGenerationLoading from "./pages/ScriptGenerationLoading";
import VideoGenerationLoading from "./pages/VideoGenerationLoading";

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
              <Route path="/auth-new" element={<AuthNew />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
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
                    <AdminRoute>
                      <WebhookSettings />
                    </AdminRoute>
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
                path="/job/:identifier/submission-loading" 
                element={
                  <ProtectedRoute>
                    <SubmissionLoading />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/job/:identifier/script-generation-loading" 
                element={
                  <ProtectedRoute>
                    <ScriptGenerationLoading />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/job/:identifier/video-generation-loading" 
                element={
                  <ProtectedRoute>
                    <VideoGenerationLoading />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/job/:identifier/review" 
                element={
                  <ProtectedRoute>
                    <JobReview />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/job/:identifier/script" 
                element={
                  <ProtectedRoute>
                    <JobScript />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/job/:identifier/result" 
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
