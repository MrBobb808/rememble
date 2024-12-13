import { inject } from '@vercel/analytics';
import * as Sentry from "@sentry/react";
import { ReportHandler } from 'web-vitals';

// Initialize Vercel Analytics
export const initializeAnalytics = () => {
  inject();
};

// Initialize Sentry for error tracking
export const initializeSentry = () => {
  Sentry.init({
    dsn: "YOUR_SENTRY_DSN", // Replace with your Sentry DSN
    integrations: [
      new Sentry.BrowserTracing({
        tracePropagationTargets: ["localhost", /^https:\/\/lovable\.dev/],
      }),
      new Sentry.Replay(),
    ],
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
};

// Report web vitals for performance monitoring
export const reportWebVitals = (onPerfEntry?: ReportHandler) => {
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
  if (window.va) {
    window.va.track(eventName, properties);
  }
  
  // Send to Sentry
  Sentry.addBreadcrumb({
    category: 'user-action',
    message: eventName,
    data: properties,
  });
};