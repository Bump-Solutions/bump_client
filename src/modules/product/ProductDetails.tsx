import { useProduct } from "../../hooks/product/useProduct";
import { useFacetedSearch } from "../../hooks/product/useFacetedSearch";
import { Link } from "react-router";

import Badges from "../../components/Badges";
import FacetedSearch from "./FacetedSearch";
import Stepper from "../../components/Stepper";
import PriceTag from "./PriceTag";
import ProductActions from "./ProductActions";
import { ROUTES } from "../../routes/routes";

/*
const BADGES: BadgeCollection = {
  discount: {
    text: "-10%",
    type: "discount",
    priority: 99,
  },
  new: {
    text: "Új",
    type: "new",
    priority: 98,
  },
  popular: {
    text: "Népszerű",
    type: "popular",
    priority: 97,
  },
  recommended: {
    text: "Ajánlott",
    type: "recommended",
    priority: 96,
  },
};
*/

const ProductDetails = () => {
  const { product } = useProduct();
  const facets = useFacetedSearch(); // Ha null, akkor nincs elérhető szűrhető tétel

  if (!product) return null;

  const LABEL = [
    product.product.brand,
    product.product.model,
    product.product.colorWay,
  ].join(" ");

  const discountValue = (product.badges.discount?.value as number) || null;

  return (
    <article className='product__details'>
      <Badges badges={product.badges} initialToggle={true} showToggle={false} />

      <h1 className='mb-0_5'>{LABEL}</h1>
      {product.description && (
        <p
          className='fc-gray-700 ta-justify fs-16'
          style={{ whiteSpace: "pre-line" }}>
          {product.description}
        </p>
      )}

      {facets ? (
        <>
          <FacetedSearch {...facets} />

          <div className='product__quantity'>
            <h4>
              Darabszám{" "}
              {facets?.filteredCount > 0 && (
                <span className='fc-gray-600'>
                  - max {facets.filteredCount} db
                </span>
              )}
            </h4>
            <Stepper
              value={facets.quantity}
              min={1}
              max={facets?.filteredCount}
              onChange={(value: number) => facets.setQuantity(value)}
              disabled={facets?.filteredCount === 0}
            />
          </div>

          <PriceTag discount={discountValue} {...facets} />

          <ProductActions discount={discountValue} {...facets} />

          <Link to={ROUTES.HOME} className='link ml-auto py-0_5 fs-14'>
            Hogyan működik?
          </Link>
        </>
      ) : (
        <div className='product__no-items'>
          TODO: Nincsenek elérhető tételek.
        </div>
      )}
    </article>
  );
};

export default ProductDetails;
