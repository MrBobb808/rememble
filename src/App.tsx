import { Suspense, lazy } from "react"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { ThemeProvider } from "next-themes"
import { Loader2 } from "lucide-react"
import * as Sentry from "@sentry/react"

// Lazy load route components
const Landing = lazy(() => import("./pages/Landing.tsx"))
const Memorial = lazy(() => import("./pages/Memorial.tsx"))
const DirectorDashboard = lazy(() => import("./pages/DirectorDashboard.tsx"))
const PrintfulProduct = lazy(() => import("./pages/PrintfulProduct.tsx"))
const Auth = lazy(() => import("./pages/Auth.tsx"))
const AuthCallback = lazy(() => import("./pages/AuthCallback.tsx"))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Data stays fresh for 5 minutes
      gcTime: 1000 * 60 * 30, // Cache persists for 30 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="w-8 h-8 animate-spin text-memorial-blue" />
  </div>
)

// Error fallback component
const ErrorFallback: Sentry.FallbackRender = (errorData) => {
  const errorMessage = errorData.error && 
    typeof errorData.error === 'object' && 
    'message' in errorData.error &&
    typeof errorData.error.message === 'string'
    ? errorData.error.message
    : 'An unexpected error occurred';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
      <p className="text-gray-600 mb-4">{errorMessage}</p>
      <button 
        onClick={errorData.resetError}
        className="px-4 py-2 bg-memorial-blue text-white rounded hover:bg-memorial-blue/90"
      >
        Try again
      </button>
    </div>
  );
}

const App = () => (
  <Sentry.ErrorBoundary fallback={ErrorFallback}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<Navigate to="/auth" replace />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/landing" element={<Landing />} />
                <Route path="/memorial" element={<Memorial />} />
                <Route path="/director" element={<DirectorDashboard />} />
                <Route path="/print/:productType" element={<PrintfulProduct />} />
                <Route path="*" element={<Navigate to="/auth" replace />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </Sentry.ErrorBoundary>
)

export default App
