import "../../assets/css/product.css";
import { useProduct } from "../../hooks/product/useProduct";
import { useTitle } from "react-use";
import { useToggle } from "../../hooks/useToggle";
import { useState, MouseEvent } from "react";

import Spinner from "../../components/Spinner";
import Image from "../../components/Image";
import Back from "../../components/Back";
import Lightbox from "../../components/Lightbox";

type LayoutBox = { area: string };

type LayoutRow =
  | { type: "single" }
  | { type: "split"; boxes: LayoutBox[] }
  | { type: "nested"; boxes: LayoutBox[] };

const LAYOUT_MAP: Record<number, LayoutRow[]> = {
  3: [
    { type: "single" },
    { type: "split", boxes: [{ area: "1 / 1" }, { area: "1 / 2" }] },
  ],
  4: [
    { type: "single" },
    { type: "split", boxes: [{ area: "1 / 1" }, { area: "1 / 2" }] },
    { type: "single" },
  ],
  5: [
    { type: "single" },
    {
      type: "nested",
      boxes: [{ area: "1 / 1 / span 2" }, { area: "1 / 2" }, { area: "2 / 2" }],
    },
    { type: "single" },
  ],
  6: [
    { type: "single" },
    { type: "split", boxes: [{ area: "1 / 1" }, { area: "1 / 2" }] },
    { type: "single" },
    { type: "split", boxes: [{ area: "1 / 1" }, { area: "1 / 2" }] },
  ],
  7: [
    { type: "single" },
    {
      type: "nested",
      boxes: [{ area: "1 / 1 / span 2" }, { area: "1 / 2" }, { area: "2 / 2" }],
    },
    { type: "single" },
    { type: "split", boxes: [{ area: "1 / 1" }, { area: "1 / 2" }] },
  ],
  8: [
    { type: "single" },
    {
      type: "nested",
      boxes: [{ area: "1 / 1 / span 2" }, { area: "1 / 2" }, { area: "2 / 2" }],
    },
    { type: "single" },
    {
      type: "nested",
      boxes: [{ area: "1 / 2 / span 2" }, { area: "1 / 1" }, { area: "2 / 1" }],
    },
  ],
  9: [
    { type: "single" },
    { type: "split", boxes: [{ area: "1 / 1" }, { area: "1 / 2" }] },
    {
      type: "nested",
      boxes: [{ area: "1 / 1 / span 2" }, { area: "1 / 2" }, { area: "2 / 2" }],
    },
    { type: "single" },
    { type: "split", boxes: [{ area: "1 / 1" }, { area: "1 / 2" }] },
  ],
  10: [
    { type: "single" },
    { type: "split", boxes: [{ area: "1 / 1" }, { area: "1 / 2" }] },
    {
      type: "nested",
      boxes: [{ area: "1 / 2 / span 2" }, { area: "1 / 1" }, { area: "2 / 1" }],
    },
    { type: "single" },
    { type: "split", boxes: [{ area: "1 / 1" }, { area: "1 / 2" }] },
    { type: "single" },
  ],
};

const Gallery = () => {
  const { product, isLoading, isError } = useProduct();

  // Lightbox state
  const [lightboxOpen, toggleLightbox] = useToggle(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useTitle(`Képek - ${product ? product.title : "Termék"} - Bump`);

  if (isLoading) return <Spinner />;

  if (isError) return null;

  const { images } = product;
  const layout = LAYOUT_MAP[images.length];

  let imageIndex = 0;

  const handleClick = (event: MouseEvent<HTMLDivElement>, index: number) => {
    event.stopPropagation();
    event.preventDefault();

    setCurrentIndex(index);
    toggleLightbox(true);
  };

  return (
    <section className='product'>
      <div className='gallery__wrapper'>
        <Back />

        <div className='grid'>
          {layout.map((row, rowIndex) => {
            if (row.type === "single") {
              // Capture current index before increment
              const idx = imageIndex;
              const image = images[idx];
              imageIndex++;
              if (!image) return null;

              return (
                <div
                  key={rowIndex}
                  className='grid-row'
                  onClick={(e) => handleClick(e, idx)}>
                  <Image src={image.src} alt={`${idx + 1}. kép `} />
                </div>
              );
            }

            if (row.type === "split" || row.type === "nested") {
              return (
                <div
                  key={rowIndex}
                  className='grid-row complex-row'
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gridAutoRows: "1fr",
                    gap: "0.5rem",
                  }}>
                  {row.boxes.map((box, i) => {
                    // Capture index for each box
                    const idx = imageIndex;
                    const image = images[idx];
                    imageIndex++;
                    if (!image) return null;

                    return (
                      <div
                        key={i}
                        style={{ gridArea: box.area }}
                        onClick={(e) => handleClick(e, idx)}>
                        <Image src={image.src} alt={`${idx + 1}. kép `} />
                      </div>
                    );
                  })}
                </div>
              );
            }

            return null;
          })}
        </div>
      </div>

      {lightboxOpen && (
        <Lightbox
          attachments={images.map((image) => image.src)}
          initialIndex={currentIndex}
          onClose={() => toggleLightbox(false)}
        />
      )}
    </section>
  );
};

export default Gallery;
