"use client";

import { useState, useEffect } from 'react';

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    // Check if we're in the browser
    if (typeof window === 'undefined') return;

    // Set initial state
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      console.log('[Network] Connection restored');
      setIsOnline(true);
      if (wasOffline) {
        // Optionally reload the page or refetch data
        window.location.reload();
      }
    };

    const handleOffline = () => {
      console.log('[Network] Connection lost');
      setIsOnline(false);
      setWasOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [wasOffline]);

  return { isOnline, wasOffline };
}

