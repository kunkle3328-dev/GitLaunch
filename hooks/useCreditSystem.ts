import { useState, useEffect, useCallback } from 'react';

const CREDITS_KEY = 'gitlaunch_uploads_left';
const INITIAL_FREE_UPLOADS = 3;

export const useCreditSystem = () => {
  const [uploadsLeft, setUploadsLeft] = useState<number>(() => {
    const savedUploads = localStorage.getItem(CREDITS_KEY);
    if (savedUploads !== null) {
      // Ensure we don't return NaN if localStorage is tampered with
      const parsedUploads = parseInt(savedUploads, 10);
      return isNaN(parsedUploads) ? INITIAL_FREE_UPLOADS : parsedUploads;
    }
    // Set initial free uploads if nothing is in localStorage
    localStorage.setItem(CREDITS_KEY, INITIAL_FREE_UPLOADS.toString());
    return INITIAL_FREE_UPLOADS;
  });

  useEffect(() => {
    // This effect ensures that any change to uploadsLeft is saved.
    localStorage.setItem(CREDITS_KEY, uploadsLeft.toString());
  }, [uploadsLeft]);

  const isOutOfCredits = uploadsLeft <= 0;

  const decrementUploads = useCallback(() => {
    setUploadsLeft((prev) => {
        const newValue = Math.max(0, prev - 1);
        return newValue;
    });
  }, []);
  
  // addCredits function is removed as this is now a "manual" process
  // after the user pays via the store. A backend would typically handle this.
  // To test adding credits, you can manually change the value in localStorage.

  return { uploadsLeft, isOutOfCredits, decrementUploads };
};
