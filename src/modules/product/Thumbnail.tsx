import { ENUM } from "../../utils/enum";
import { ROUTES } from "../../routes/routes";
import { useProduct } from "../../hooks/product/useProduct";
import { useMediaQuery } from "react-responsive";
import { Link } from "react-router";

import Badges from "./Badges";
import Image from "../../components/Image";

import { Grip } from "lucide-react";

const Thumbnail = () => {
  const { product } = useProduct();

  var maxGridItems = product.images.length > 4 ? 5 : 3;

  const isMobile = useMediaQuery({
    query: `(max-width: ${ENUM.MEDIA_MOBILE}px)`,
  });

  if (isMobile) {
    maxGridItems = 3;
  }

  return (
    <div className='product__images'>
      {Object.keys(product.badges).length > 0 && (
        <Badges badges={product.badges} initialToggle={true} />
      )}

      {product.images.length > maxGridItems && (
        <Link
          to={ROUTES.PRODUCT(product.id).GALLERY}
          className='button secondary fill md'>
          <Grip /> Összes kép megtekintése
        </Link>
      )}

      <div className={`image-grid ${maxGridItems > 4 ? "grid-5" : "grid-3"}`}>
        {product.images.slice(0, maxGridItems).map((image, index) => (
          <Link key={index} to={ROUTES.PRODUCT(product.id).GALLERY}>
            <Image src={image.src} alt={product.title} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Thumbnail;
