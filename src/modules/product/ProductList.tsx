import { InventoryModel } from "../../models/productModel";
import { Fragment, useEffect } from "react";
import { useProfile } from "../../hooks/profile/useProfile";
import { useInView } from "react-intersection-observer";
import { PaginatedListProps } from "../../types/ui";
import { Link, useLocation } from "react-router";
import { ROUTES } from "../../routes/routes";

import ProductListItem from "./ProductListItem";
import Spinner from "../../components/Spinner";

import { CirclePlus } from "lucide-react";

const ProductList = ({
  pages,
  fetchNextPage,
  isFetchingNextPage,
}: PaginatedListProps<InventoryModel>) => {
  const location = useLocation();
  const { isOwnProfile } = useProfile();

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  // Don't show the dummy product if we are on the saved products page
  const isSavedPage = location.pathname.includes("/saved");

  return (
    <>
      <ul className='products__list'>
        {/* If isOwnProfile, place a dummy ProductListItem to quick add a product */}
        {isOwnProfile && !isSavedPage && (
          <li className='dummy'>
            <Link to={ROUTES.SELL} state={{ background: location }}>
              <CirclePlus />
              <h4>Új termék feltöltése</h4>
            </Link>
          </li>
        )}

        {pages.map((page, index) => (
          <Fragment key={index}>
            {page.products.map((product, idx) => (
              <ProductListItem key={idx} product={product} />
            ))}
          </Fragment>
        ))}
      </ul>

      <div ref={ref}>
        {isFetchingNextPage && (
          <div className='relative py-3'>
            <Spinner />
          </div>
        )}
      </div>
    </>
  );
};

export default ProductList;
