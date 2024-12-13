import { Suspense, lazy } from "react"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "next-themes"
import { Loader2 } from "lucide-react"
import * as Sentry from "@sentry/react"

// Lazy load route components
const Index = lazy(() => import("./pages/Index"))
const Landing = lazy(() => import("./pages/Landing"))
const Memorial = lazy(() => import("./pages/Memorial"))

// Configure React Query with caching strategies
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Data stays fresh for 5 minutes
      gcTime: 1000 * 60 * 30, // Cache persists for 30 minutes (renamed from cacheTime)
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="w-8 h-8 animate-spin text-memorial-blue" />
  </div>
)

// Error fallback component
const ErrorFallback = ({ error }: { error: Error }) => (
  <div className="min-h-screen flex flex-col items-center justify-center p-4">
    <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
    <p className="text-gray-600 mb-4">{error.message}</p>
    <button 
      onClick={() => window.location.reload()} 
      className="px-4 py-2 bg-memorial-blue text-white rounded hover:bg-memorial-blue/90"
    >
      Try again
    </button>
  </div>
)

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
                <Route path="/" element={<Index />} />
                <Route path="/landing" element={<Landing />} />
                <Route path="/memorial" element={<Memorial />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </Sentry.ErrorBoundary>
)

export default App