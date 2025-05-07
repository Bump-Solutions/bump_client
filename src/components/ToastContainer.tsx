import { useToast } from "../hooks/useToast";
import { createPortal } from "react-dom";

import Toast from "./Toast";

const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  return createPortal(
    <div className='toast__wrapper'>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          type={toast.type}
          message={toast.message}
          onClose={removeToast}
        />
      ))}
    </div>,
    document.body
  );
};

export default ToastContainer;
