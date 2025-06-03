
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import NewJob from "./pages/NewJob";
import JobReview from "./pages/JobReview";
import JobScript from "./pages/JobScript";
import JobResult from "./pages/JobResult";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
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
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
