import { ROUTES } from "../../routes/routes";
import { useProduct } from "../../hooks/product/useProduct";
import { Link } from "react-router";

import Badges from "./Badges";
import Image from "../../components/Image";

import { Grip } from "lucide-react";

const Thumbnail = () => {
  const { product } = useProduct();

  return (
    <div className='product__images'>
      {Object.keys(product.badges).length > 0 && (
        <Badges badges={product.badges} initialToggle={true} />
      )}

      {product.images.length > 3 && (
        <Link
          to={ROUTES.PRODUCT(product.id).GALLERY}
          className='button secondary fill md'>
          <Grip /> Összes kép megtekintése
        </Link>
      )}

      <div className='image-grid'>
        {product.images.slice(0, 3).map((image, index) => (
          <Link key={index} to={ROUTES.PRODUCT(product.id).GALLERY}>
            <Image src={image.src} alt={product.title} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Thumbnail;
