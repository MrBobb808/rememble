import { inject } from '@vercel/analytics';
import * as Sentry from "@sentry/react";
import type { Metric } from 'web-vitals';

// Initialize Vercel Analytics
export const initializeAnalytics = () => {
  inject();
};

// Initialize Sentry for error tracking
export const initializeSentry = () => {
  Sentry.init({
    dsn: "https://a7abc351712e1286638b359d2f7ab626@o4508458716102656.ingest.us.sentry.io/4508458719510528",
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate: 1.0,
    tracePropagationTargets: ["localhost", /^https:\/\/lovable\.dev/],
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
};

// Report web vitals for performance monitoring
export const reportWebVitals = (onPerfEntry?: (metric: Metric) => void) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
      onCLS(onPerfEntry);
      onFID(onPerfEntry);
      onFCP(onPerfEntry);
      onLCP(onPerfEntry);
      onTTFB(onPerfEntry);
    });
  }
};

// Custom event tracking
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  // Track in console during development
  if (import.meta.env.DEV) {
    console.log('Event tracked:', eventName, properties);
  }
  
  // Send to Vercel Analytics
  if (typeof window.va === 'function') {
    // Map custom event names to Vercel Analytics event types
    const vaEventType = eventName.startsWith('page_') ? 'pageview' : 'event';
    window.va(vaEventType, properties);
  }
  
  // Send to Sentry
  Sentry.addBreadcrumb({
    category: 'user-action',
    message: eventName,
    data: properties,
  });
};