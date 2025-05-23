import "../assets/css/image.css";
import { createPortal } from "react-dom";
import { animate, motion, useMotionValue } from "framer-motion";
import { useCallback, useEffect, useRef, useState, MouseEvent } from "react";

import Button from "./Button";
import Image from "./Image";

import { ArrowLeft, ArrowRight, X } from "lucide-react";

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

  const footerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);

  // Scroll thumbnails when index changes
  useEffect(() => {
    const footer = footerRef.current;
    const thumbs = containerRef.current;
    if (!footer || !thumbs) return;

    x.stop();

    const containerW = footer.clientWidth;
    const children = Array.from(thumbs.children) as HTMLElement[];
    const active = children[currentIndex];
    const last = children[children.length - 1];
    if (!active || !last) return;

    const totalWidth = last.offsetLeft + last.clientWidth;
    let target: number;

    // If thumbnails fit within container, center the strip
    if (totalWidth <= containerW) {
      target = (containerW - totalWidth) / 2;
    } else {
      // Center active thumb
      const raw = (containerW - active.clientWidth) / 2 - active.offsetLeft;
      const maxOffset = 0;
      const rightBound = containerW - totalWidth;
      target = Math.max(Math.min(raw, maxOffset), rightBound);
    }

    animate(x, target, {
      type: "tween",
      duration: 0.2,
      ease: [0.25, 0.46, 0.45, 0.94],
    });
  }, [currentIndex, x]);

  const prev = () =>
    setCurrentIndex((prevIndex) =>
      prevIndex - 1 < 0 ? attachments.length - 1 : prevIndex - 1
    );

  const next = () =>
    setCurrentIndex((prevIndex) =>
      prevIndex + 1 === attachments.length ? 0 : prevIndex + 1
    );

  const handleClick = (event: MouseEvent<HTMLDivElement>, index: number) => {
    event.stopPropagation();
    setCurrentIndex(index);
  };

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

      <article
        className='lightbox__stepper prev'
        onClick={(e) => {
          e.stopPropagation();
          prev();
        }}>
        <span>
          <ArrowLeft />
        </span>
      </article>

      <div className='lightbox__content'>
        <div className='lightbox__image'>
          <Image
            src={attachments[currentIndex]}
            alt={`${currentIndex + 1}. kép`}
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        <footer
          ref={footerRef}
          className='lightbox__footer'
          onClick={(e) => e.stopPropagation()}>
          {/* Ez mozog x alapján */}
          <motion.div
            ref={containerRef}
            className='thumb__wrapper'
            style={{ x }}>
            {attachments.map((src, idx) => (
              <Image
                key={idx}
                src={src}
                alt={`${idx + 1}. kép`}
                className={`${idx === currentIndex ? "active" : ""}`}
                onClick={(e) => handleClick(e, idx)}
              />
            ))}
          </motion.div>
        </footer>
      </div>

      <article
        className='lightbox__stepper next'
        onClick={(e) => {
          e.stopPropagation();
          next();
        }}>
        <span>
          <ArrowRight />
        </span>
      </article>
    </section>,
    document.body
  );
};

export default Lightbox;
