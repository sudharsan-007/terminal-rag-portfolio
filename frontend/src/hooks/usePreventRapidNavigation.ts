import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * A hook that prevents rapid navigation between pages
 * Helps prevent the app from crashing when navigating quickly between heavy pages
 * 
 * @param cooldownMs The cooldown period in milliseconds before allowing another navigation
 */
export function usePreventRapidNavigation(cooldownMs = 400) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);
  const lastNavigationTime = useRef(0);
  const pendingNavigation = useRef<string | null>(null);
  
  useEffect(() => {
    // Reset navigation state when location changes
    const now = Date.now();
    lastNavigationTime.current = now;
    
    const timeout = setTimeout(() => {
      setIsNavigating(false);
      
      // Process any pending navigation
      if (pendingNavigation.current) {
        navigate(pendingNavigation.current);
        pendingNavigation.current = null;
      }
    }, cooldownMs);
    
    return () => clearTimeout(timeout);
  }, [location, cooldownMs, navigate]);
  
  // Function to safely navigate with cooldown
  const safeNavigate = (to: string) => {
    const now = Date.now();
    const timeSinceLastNavigation = now - lastNavigationTime.current;
    
    if (timeSinceLastNavigation < cooldownMs) {
      // We're in cooldown period, store the navigation request
      pendingNavigation.current = to;
      setIsNavigating(true);
    } else {
      // We can navigate directly
      lastNavigationTime.current = now;
      setIsNavigating(true);
      navigate(to);
    }
  };
  
  return { isNavigating, safeNavigate };
} 