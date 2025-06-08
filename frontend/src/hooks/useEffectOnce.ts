import { useEffect, useRef } from 'react';

/**
 * Hook that runs an effect only once
 * This is useful for initialization code that should only run once
 * even if the component re-renders multiple times
 */
export function useEffectOnce(effect: () => void | (() => void)) {
  const hasRunOnce = useRef(false);
  const cleanupRef = useRef<(() => void) | void>(undefined);

  useEffect(() => {
    if (!hasRunOnce.current) {
      hasRunOnce.current = true;
      cleanupRef.current = effect();
    }
    
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, []);
} 