import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import { TriangleAlert, Info, X, CircleCheck, OctagonX } from "lucide-react";

interface ToastProps {
  id: number;
  type: string;
  message: string | object;
  onClose: (id: number) => void;
}

const Toast = ({ id, type, message, onClose }: ToastProps) => {
  const [timerId, setTimerId] = useState<ReturnType<typeof setTimeout> | null>(
    null
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 5000);

    setTimerId(timer);

    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [id, onClose]);

  // Fallback message for unexpected types
  const msg =
    typeof message !== "string"
      ? "Sajnáljuk, váratlan szerverhiba történt!" // Default message
      : message;

  return (
    <motion.div
      initial={{ opacity: 0, x: "100%" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: "100%" }}
      transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`toast ${type}`}>
      {type === "success" && <CircleCheck className='toast__icon' />}
      {type === "error" && <OctagonX className='toast__icon' />}
      {type === "info" && <Info className='toast__icon' />}
      {type === "warning" && <TriangleAlert className='toast__icon' />}
      <h3>{msg}</h3>
      <button
        type='button'
        title='Bezár'
        className='toast__close'
        onClick={(e) => {
          e.stopPropagation();
          onClose(id);
        }}>
        <X />
      </button>
    </motion.div>
  );
};

export default Toast;
