import { ENUM } from "../utils/enum";
import { ReactNode, RefObject, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useMediaQuery } from "react-responsive";
import { AnimatePresence, motion } from "framer-motion";

import { useClickOutside } from "../hooks/useClickOutside";

import Drawer from "./Drawer";
import Button from "./Button";

import { X } from "lucide-react";

interface ModalContentProps {
  children: ReactNode;
  close: () => void;
  className?: string;
  size?: "xsm" | "sm" | "md" | "lg";
  dark?: boolean;
  modalRef: RefObject<HTMLDivElement>;
}

const ModalContent = ({
  children,
  close,
  className,
  size,
  dark = false,
  modalRef,
}: ModalContentProps) => {
  return createPortal(
    <motion.section
      className={`modal__wrapper ${dark ? "dark" : ""}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.2,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}>
      <motion.div
        className={`modal ${className ? className : ""} ${size || "sm"}`}
        ref={modalRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}>
        {size !== "xsm" && (
          <Button className='secondary close' onClick={close}>
            <X />
          </Button>
        )}
        {children}
      </motion.div>
    </motion.section>,
    document.body
  );
};

interface ModalProps {
  children: ReactNode;
  isOpen: boolean;
  close: () => void;
  className?: string;
  size?: "xsm" | "sm" | "md" | "lg";
}

const Modal = ({ children, isOpen, close, className, size }: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery({
    query: `(max-width: ${ENUM.MEDIA_MOBILE}px)`,
  });

  useClickOutside({
    ref: modalRef,
    callback: close,
  });

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  return (
    <AnimatePresence mode='wait'>
      {isOpen &&
        (isMobile ? (
          <Drawer close={close} className={className}>
            {children}
          </Drawer>
        ) : (
          <ModalContent
            children={children}
            close={close}
            className={className}
            size={size}
            modalRef={modalRef}
          />
        ))}
    </AnimatePresence>
  );
};

export default Modal;
