import { Inventory } from "../../types/product";
import { Fragment, useEffect } from "react";
import { useInView } from "react-intersection-observer";

import ProductListItem from "./ProductListItem";
import Spinner from "../../components/Spinner";

interface ProductListProps {
  pages: Inventory[];
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
}

const ProductList = ({
  pages,
  fetchNextPage,
  isFetchingNextPage,
}: ProductListProps) => {
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  return (
    <>
      <ul className='products__list'>
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
