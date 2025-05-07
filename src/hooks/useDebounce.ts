import {useEffect, DependencyList} from 'react';
import {useTimeout} from './useTimeout';

// Usage Example:
// useDebounce(() => alert(value), 1000, [value]);

export const useDebounce = (callback: () => void, delay: number, dependencies: DependencyList): void => {
  const {clear, reset} = useTimeout(callback, delay);

  // Reset the timeout whenever dependencies or reset changes
  useEffect(reset, [...dependencies, reset]);

  // Clear the timeout on component unmount
  useEffect(() => clear, []);
};
