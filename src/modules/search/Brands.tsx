import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { getRandomSubset } from "../../utils/functions";

type Brand = {
  label: string;
  imageFile: string;
};

const BRAND_IMAGE_BASE = "/src/assets/images/brands/";

const BRANDS: Brand[] = [
  { label: "Adidas", imageFile: "adidas.png" },
  { label: "Asics", imageFile: "asics.jpeg" },
  { label: "Nike", imageFile: "nike.jpeg" },
  { label: "Air Jordan", imageFile: "air_jordan.jpg" },
  { label: "New Balance", imageFile: "new_balance.jpeg" },
  { label: "Puma", imageFile: "puma.jpeg" },
  { label: "Converse", imageFile: "converse.jpeg" },
  { label: "Yeezy", imageFile: "yeezy.jpeg" },
  { label: "Fear Of God", imageFile: "fear_of_god.jpeg" },
  { label: "Stüssy", imageFile: "stussy.png" },
  { label: "Vans", imageFile: "vans.jpeg" },
  { label: "Reebok", imageFile: "reebok.png" },
];

interface BrandProps {
  setSearchKey: Dispatch<SetStateAction<string>>;
}

const Brands = ({ setSearchKey }: BrandProps) => {
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    const selected = getRandomSubset(BRANDS, 8);
    setBrands(selected);
  }, []);

  return (
    <section className='search__brands'>
      <h3>Népszerű márkák</h3>
      <div className='brands'>
        {brands.map((brand, index) => (
          <div
            key={index}
            className='brand'
            onClick={() => setSearchKey(brand.label)}>
            <div>
              <img
                src={`${BRAND_IMAGE_BASE}${brand.imageFile}`}
                alt={brand.label}
              />
              <span className='truncate'>{brand.label}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Brands;
