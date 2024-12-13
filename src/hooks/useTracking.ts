import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackEvent } from '@/lib/analytics';

export const useTracking = () => {
  const location = useLocation();

  // Track page views
  useEffect(() => {
    trackEvent('page_view', {
      path: location.pathname,
      search: location.search,
    });
  }, [location]);

  // Return tracking utilities
  return {
    trackEvent,
    trackClick: (elementName: string) => 
      trackEvent('click', { element: elementName }),
    trackFormSubmit: (formName: string) => 
      trackEvent('form_submit', { form: formName }),
    trackError: (error: Error) => 
      trackEvent('error', { 
        message: error.message, 
        stack: error.stack 
      }),
  };
};