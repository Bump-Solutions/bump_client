import "../assets/css/image.css";
import { createPortal } from "react-dom";
import { useCallback, useEffect, useState } from "react";

import Button from "./Button";
import Image from "./Image";

import { X } from "lucide-react";

// Fullscreen image viewer component

interface LightboxProps {
  attachments: string[];
  initialIndex: number;
  onClose: () => void;
}

const Lightbox = ({
  attachments,
  initialIndex = 0,
  onClose,
}: LightboxProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const prev = () =>
    setCurrentIndex(
      (idx) => (idx - 1 + attachments.length) % attachments.length
    );

  const next = () => setCurrentIndex((idx) => (idx + 1) % attachments.length);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      switch (event.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          prev();
          break;
        case "ArrowRight":
          next();
          break;
        default:
          break;
      }
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  if (!attachments || attachments.length === 0) {
    return null;
  }

  console.log("Lightbox", attachments[currentIndex], currentIndex);

  return createPortal(
    <section
      className='lightbox__wrapper'
      onClick={onClose}
      style={{
        backgroundImage: `url(${attachments[currentIndex]})`,
      }}>
      <Button className='secondary close' onClick={onClose}>
        <X />
      </Button>

      <div className='lightbox__content'>
        <article></article>

        <div className='lightbox__image'>
          <Image
            src={attachments[currentIndex]}
            alt={`${currentIndex + 1}. kép`}
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        <article></article>
      </div>

      <footer className='lightbox__footer'></footer>
    </section>,
    document.body
  );
};

export default Lightbox;
