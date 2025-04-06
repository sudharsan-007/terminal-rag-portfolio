import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * A hook that suspends heavy animations during navigation
 * and for a short period after navigation to ensure smooth transitions
 * 
 * @param suspendDurationMs Duration in ms to continue suspending animations after navigation
 */
export function useSuspendAnimations(suspendDurationMs = 800) {
  const location = useLocation();
  const [shouldSuspend, setShouldSuspend] = useState(false);
  
  useEffect(() => {
    // Suspend animations on navigation
    setShouldSuspend(true);
    
    // After the specified duration, resume animations
    const timeout = setTimeout(() => {
      setShouldSuspend(false);
    }, suspendDurationMs);
    
    return () => clearTimeout(timeout);
  }, [location, suspendDurationMs]);
  
  return shouldSuspend;
} 