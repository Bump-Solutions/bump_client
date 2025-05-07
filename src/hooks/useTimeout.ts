import {useCallback, useEffect, useRef} from 'react';

// Usage Example: const { clear, reset } = useTimeout(() => console.log('Hello'), 1000);
export const useTimeout = (callback: () => void, delay: number) => {
  const timeoutRef = useRef<number | null>(null);
  const callbackRef = useRef(callback);

  // Update the callback reference if it changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const set = useCallback(() => {
    if (delay !== null) {
      timeoutRef.current = window.setTimeout(() => callbackRef.current(), delay);
    }
  }, [delay]);

  // Clear the timeout
  const clear = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Effect to handle setting and clearing the timeout on mount/unmount
  useEffect(() => {
    set();
    return clear;
  }, [delay, set, clear]);

  // Reset the timeout
  const reset = useCallback(() => {
    clear();
    set();
  }, [clear, set]);

  return {clear, reset};
};
