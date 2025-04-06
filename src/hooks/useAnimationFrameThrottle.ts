import { useRef, useCallback, useEffect } from 'react';

/**
 * A hook that throttles requestAnimationFrame to reduce CPU usage
 * Especially useful for heavy animations on lower-end devices
 * 
 * @param callback The animation callback function
 * @param throttleRate How many frames to skip (1 = every frame, 2 = every other frame, etc.)
 * @param dependencies Dependencies array that will trigger reinitialization of the throttle
 */
export function useAnimationFrameThrottle(
  callback: (timestamp: number) => void,
  throttleRate = 1,
  dependencies: any[] = []
) {
  const requestRef = useRef<number | null>(null);
  const frameCountRef = useRef(0);
  const previousTimeRef = useRef<number | null>(null);
  const callbackRef = useRef(callback);
  
  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);
  
  const animate = useCallback((time: number) => {
    if (previousTimeRef.current === null) {
      previousTimeRef.current = time;
    }
    
    // Increment the frame counter
    frameCountRef.current += 1;
    
    // Only execute callback every throttleRate frames
    if (frameCountRef.current >= throttleRate) {
      callbackRef.current(time);
      frameCountRef.current = 0;
    }
    
    // Schedule the next frame
    requestRef.current = requestAnimationFrame(animate);
  }, [throttleRate]);
  
  useEffect(() => {
    // Reset counters and start animation loop
    frameCountRef.current = 0;
    previousTimeRef.current = null;
    requestRef.current = requestAnimationFrame(animate);
    
    // Cleanup
    return () => {
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [animate, ...dependencies]);
  
  // Function to manually cancel the animation frame
  const cancelAnimation = useCallback(() => {
    if (requestRef.current !== null) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = null;
    }
  }, []);
  
  // Function to restart the animation
  const restartAnimation = useCallback(() => {
    if (requestRef.current === null) {
      frameCountRef.current = 0;
      previousTimeRef.current = null;
      requestRef.current = requestAnimationFrame(animate);
    }
  }, [animate]);
  
  return { cancelAnimation, restartAnimation };
} 