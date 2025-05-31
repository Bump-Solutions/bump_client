import { useState } from "react";
import { useProduct } from "../../hooks/product/useProduct";
import { useToggle } from "../../hooks/useToggle";

import Image from "../../components/Image";
import Lightbox from "../../components/Lightbox";

const MAX_IMAGES = 3; // Maximum number of images to display

const Thumbnail = () => {
  const { product } = useProduct();

  const images = product?.images;
  const [activeIndex, setActiveIndex] = useState(0);

  const [lightboxOpen, toggleLightbox] = useToggle(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const showCount = images.length > MAX_IMAGES ? MAX_IMAGES : images.length;
  const extraCount = images.length - showCount;

  const handleClick = (index: number) => {
    setLightboxIndex(index);
    toggleLightbox(true);
  };

  return (
    <>
      <div className='product__thumbnail'>
        {/* Nagy kép */}
        <div
          className='product__thumbnail--main'
          onClick={() => handleClick(activeIndex)}>
          <Image
            src={images[activeIndex].src}
            alt={`Termék ${activeIndex + 1}. kép`}
          />
        </div>

        {/* Mini-képek */}
        <ul className='product__thumbnail--list'>
          {images.slice(0, showCount).map((img, idx) => (
            <li
              key={idx}
              className={`product__thumbnail--item ${
                idx === activeIndex ? "active" : ""
              }`}
              onClick={() => setActiveIndex(idx)}
              onDoubleClick={() => handleClick(idx)}>
              <Image src={img.src} alt={`Termék ${idx + 1}. kép`} />
            </li>
          ))}

          {images.length > MAX_IMAGES && (
            <li
              key='more'
              className='product__thumbnail--item more'
              onClick={() => {
                handleClick(showCount);
              }}>
              <span>
                +{extraCount}
                <br />
                bővebben
              </span>
            </li>
          )}
        </ul>
      </div>

      {lightboxOpen && (
        <Lightbox
          attachments={images.map((i) => i.src)}
          initialIndex={lightboxIndex}
          onClose={() => toggleLightbox(false)}
        />
      )}
    </>
  );
};

export default Thumbnail;
