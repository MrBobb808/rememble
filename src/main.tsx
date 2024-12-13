import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeAnalytics, initializeSentry, reportWebVitals } from './lib/analytics'

// Initialize analytics and monitoring
initializeAnalytics();
initializeSentry();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)

// Report performance metrics
reportWebVitals(console.log);