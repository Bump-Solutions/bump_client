import { createContext, useReducer, useState, ReactNode } from "react";

// Define the shape of a Toast
interface Toast {
  id: number;
  type: string;
  message: string;
}

// Define the state structure
interface ToastState {
  toasts: Toast[];
}

// Define action types and payloads
type ToastAction =
  | { type: "ADD_TOAST"; payload: Toast }
  | { type: "REMOVE_TOAST"; payload: number };

// Define the context type
interface ToastContextType {
  toasts: Toast[];
  addToast: (type: string, message: string) => void;
  removeToast: (id: number) => void;
}

// Define props for the provider
interface ToastProviderProps {
  children: ReactNode;
}

// Initial state
const INITIAL_STATE: ToastState = {
  toasts: [],
};

// Create the context
export const ToastContext = createContext<ToastContextType | undefined>(
  undefined
);

// Reducer function
const toastReducer = (state: ToastState, action: ToastAction): ToastState => {
  switch (action.type) {
    case "ADD_TOAST":
      return { toasts: [...state.toasts, action.payload] };
    case "REMOVE_TOAST":
      return {
        toasts: state.toasts.filter((toast) => toast.id !== action.payload),
      };
    default:
      return state;
  }
};

// Provider component
const ToastProvider = ({ children }: ToastProviderProps) => {
  const [state, dispatch] = useReducer(toastReducer, INITIAL_STATE);

  const [timers, setTimers] = useState({});

  const addToast = (type: string, message: string): void => {
    if (state.toasts.length < 5) {
      const id = Date.now();
      dispatch({ type: "ADD_TOAST", payload: { id, type, message } });

      // Set a timer for this toast
      const timer = setTimeout(() => {
        removeToast(id);
      }, 5000);
      setTimers((prevTimers) => ({ ...prevTimers, [id]: timer }));
    }
  };

  const removeToast = (id: number): void => {
    dispatch({ type: "REMOVE_TOAST", payload: id });

    // Clear the timer
    if (timers[id]) {
      clearTimeout(timers[id]);
      setTimers((prevTimers) => {
        const updatedTimers = { ...prevTimers };
        delete updatedTimers[id];
        return updatedTimers;
      });
    }
  };

  return (
    <ToastContext value={{ toasts: state.toasts, addToast, removeToast }}>
      {children}
    </ToastContext>
  );
};

export default ToastProvider;
