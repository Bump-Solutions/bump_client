import "../../assets/css/product.css";
import { ROUTES } from "../../routes/routes";
import { InventoryModel } from "../../models/productModel";
import { Link, useLocation } from "react-router";
import { useProfile } from "../../hooks/profile/useProfile";
import { useListProducts } from "../../hooks/product/useListProducts";

import Spinner from "../../components/Spinner";
import ProductList from "./ProductList";

import { SearchX, Tag } from "lucide-react";

const Products = () => {
  const location = useLocation();
  const { user, isOwnProfile } = useProfile();

  const { data, isLoading, isFetchingNextPage, isError, fetchNextPage } =
    useListProducts([user?.id], {
      uid: user?.id!,
    });

  const pages: InventoryModel[] = data?.pages || [];

  if (isError) {
    return (
      <h4 className='fc-red-500 ta-center py-5'>
        Hiba történt a termékek betöltése közben.
      </h4>
    );
  }

  if (isLoading) {
    return (
      <div className='relative py-5'>
        <Spinner />
      </div>
    );
  }

  return (
    <section className='user-products__wrapper'>
      {pages.length > 0 && (
        <>
          {pages[0].products.length > 0 ? (
            <ProductList
              pages={pages}
              fetchNextPage={fetchNextPage}
              isFetchingNextPage={isFetchingNextPage}
            />
          ) : isOwnProfile ? (
            <>
              <div className='fc-light ta-center p-5 d-flex flex-column a-center gap-1 '>
                <SearchX className='svg-64 fc-gray-400' />
                <div className='ta-center'>
                  <h4 className='fw-600 mb-0_25 fs-18'>
                    Még nem hírdettél meg terméket.{" "}
                  </h4>
                  <p className='fc-light fs-16'>
                    Kattints a gombra és töltsd fel első termékedet.
                  </p>
                </div>
                <Link
                  to={ROUTES.SELL}
                  state={{ background: location }}
                  className='button primary w-fc mx-auto'>
                  <Tag />
                  Add el most!
                </Link>
              </div>
            </>
          ) : (
            <div className='fc-light ta-center p-5'>
              <SearchX className='svg-64 fc-gray-400' />
              <div className='ta-center'>
                <h4 className='fw-600 mb-0_25 fs-18'>
                  {user?.username} még nem rendelkezik termékekkel.
                </h4>
                <p className='fc-light fs-16'>
                  Kattints az értesítések gombra, hogy értesülj a legújabb
                  termékekről.
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default Products;
