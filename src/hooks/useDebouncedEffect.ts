import { useEffect, useRef } from 'react';

/**
 * A hook that runs an effect only after the specified delay has passed without the dependencies changing
 * Useful for preventing multiple expensive operations during rapid state changes
 * 
 * @param effect The function to run
 * @param deps The dependencies array
 * @param delay The debounce delay in milliseconds
 */
export function useDebouncedEffect(
  effect: () => void | (() => void),
  deps: React.DependencyList,
  delay: number
) {
  const callback = useRef(effect);
  const cleanup = useRef<void | (() => void)>();
  
  // Update the callback ref when the effect changes
  useEffect(() => {
    callback.current = effect;
  }, [effect]);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      // Run cleanup from previous execution
      if (cleanup.current) {
        cleanup.current();
        cleanup.current = undefined;
      }
      
      // Execute the effect and store its cleanup function
      cleanup.current = callback.current();
    }, delay);
    
    // Clear the timeout if dependencies change before the delay has passed
    return () => {
      clearTimeout(handler);
    };
  }, [...deps, delay]);
  
  // Run cleanup when the component unmounts
  useEffect(() => {
    return () => {
      if (cleanup.current) {
        cleanup.current();
      }
    };
  }, []);
} 