import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { MouseEvent, useState } from "react";

interface CarouselProps {
  images: string[];
}

const Carousel = ({ images }: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const handleNext = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setCurrentIndex((prev) => (prev + 1 === images.length ? 0 : prev + 1));
  };

  const handlePrev = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setCurrentIndex((prev) => (prev - 1 < 0 ? images.length - 1 : prev - 1));
  };

  const handleDotClick = (e: MouseEvent<HTMLButtonElement>, index: number) => {
    e.preventDefault();

    setCurrentIndex(index);
  };

  const getDotRange = () => {
    const total = images.length;

    if (total <= 5) return Array.from({ length: total }, (_, i) => i);
    if (currentIndex < 3) return [0, 1, 2, 3, 4];
    if (currentIndex > total - 3)
      return [total - 5, total - 4, total - 3, total - 2, total - 1];

    return [
      currentIndex - 2,
      currentIndex - 1,
      currentIndex,
      currentIndex + 1,
      currentIndex + 2,
    ];
  };

  return (
    <div className='product__item-carousel'>
      <button
        type='button'
        title='Előző'
        onClick={handlePrev}
        className='carousel__button prev'>
        <ArrowLeft />
      </button>

      <AnimatePresence initial={false}>
        <motion.div
          className='carousel__images'
          animate={{ x: `-${currentIndex * 100}%` }}
          transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}>
          {images.map((src, index) => (
            <img key={index} src={src} alt={`Termék kép ${index + 1}`} />
          ))}
        </motion.div>
      </AnimatePresence>

      <button
        type='button'
        title='Következő'
        onClick={handleNext}
        className='carousel__button next'>
        <ArrowRight />
      </button>

      <div className='carousel__dots'>
        {getDotRange().map((index) => (
          <button
            key={index}
            type='button'
            title={`Kép ${index + 1}`}
            onClick={(e) => handleDotClick(e, index)}
            className={`dot ${index === currentIndex ? "active" : ""}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
