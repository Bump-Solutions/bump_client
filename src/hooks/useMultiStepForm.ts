import { useState, JSX, MouseEvent, RefObject } from "react";

interface Step<T> {
  name?: string;
  label: string | JSX.Element;
  description?: string | JSX.Element;
  svg?: JSX.Element;
  component: JSX.Element;
  ref: RefObject<T | null>;
}

interface StepRef {
  isValid: () => boolean;
}

export const useMultiStepForm = <T extends StepRef>(steps: Step<T>[]) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  const next = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const isValid = steps[currentStepIndex]?.ref?.current?.isValid?.();
    if (isValid) {
      setCurrentStepIndex((i) => {
        if (i >= steps.length - 1) return i;
        return i + 1;
      });
    }
  };

  const prev = () => {
    setCurrentStepIndex((i) => {
      if (i <= 0) return i;
      return i - 1;
    });
  };

  const goTo = (index: number) => {
    if (index > currentStepIndex) {
      const isValid = steps[currentStepIndex]?.ref?.current?.isValid?.();
      if (isValid) {
        setCurrentStepIndex(index);
      }
    } else {
      setCurrentStepIndex(index);
    }
  };

  return {
    currentStepIndex,
    step: steps[currentStepIndex],
    steps,
    isFirstStep: currentStepIndex === 0,
    isLastStep: currentStepIndex === steps.length - 1,
    next,
    prev,
    goTo,
  };
};
