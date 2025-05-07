import "../../assets/css/product.css";
import { useProduct } from "../../hooks/product/useProduct";
import { useTitle } from "react-use";

import Spinner from "../../components/Spinner";
import Image from "../../components/Image";

import Back from "../../components/Back";

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

  useTitle(`Képek - ${product ? product.title : "Termék"} - Bump`);

  if (isLoading) return <Spinner />;

  if (isError) return null;

  const { images } = product;
  const layout = LAYOUT_MAP[images.length];

  let imageIndex = 0;

  return (
    <section className='product'>
      <div className='gallery__wrapper'>
        <Back />

        <div className='grid'>
          {layout.map((row, rowIndex) => {
            if (row.type === "single") {
              const image = images[imageIndex++];
              if (!image) return null;

              return (
                <div key={rowIndex} className='grid-row'>
                  <Image src={image.src} alt={`${imageIndex}. kép `} />
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
                    const image = images[imageIndex++];
                    if (!image) return null;

                    return (
                      <div key={i} style={{ gridArea: box.area }}>
                        <Image src={image.src} alt={`${imageIndex}. kép `} />
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
    </section>
  );
};

export default Gallery;
