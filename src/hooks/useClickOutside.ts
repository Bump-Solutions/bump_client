import { RefObject, useEffect } from "react";

interface UseClickOutsideProps {
  ref: RefObject<HTMLElement | null>;
  callback: () => void;
  ignoreRefs?: RefObject<HTMLElement | null>[];
}

export const useClickOutside = ({
  ref,
  callback,
  ignoreRefs = [],
}: UseClickOutsideProps) => {
  const handleClick = (event: MouseEvent) => {
    const target = event.target as Node;

    // Check if the click is outside the `ref` and not on any `ignoreRefs`
    if (
      ref.current &&
      !ref.current.contains(target) &&
      !ignoreRefs.some((ignoreRef) => ignoreRef.current?.contains(target))
    ) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [ref, callback, ignoreRefs]);
};
