import {useCallback, useEffect, useRef} from 'react';

// Custom hook to check if the component is mounted
export const useMounted = (): (() => boolean) => {
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  return useCallback(() => isMounted.current, []);
};
