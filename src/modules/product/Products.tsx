import "../../assets/css/product.css";
import { ROUTES } from "../../routes/routes";
import { InventoryModel } from "../../models/productModel";
import { Link, useLocation } from "react-router";
import { useProfile } from "../../hooks/profile/useProfile";
import { useEffect, useState } from "react";
import { useListProducts } from "../../hooks/product/useListProducts";

import Spinner from "../../components/Spinner";
import ProductList from "./ProductList";

import { SearchX, Tag } from "lucide-react";

const Products = () => {
  const location = useLocation();
  const { user, isOwnProfile } = useProfile();

  const [pages, setPages] = useState<InventoryModel[] | null>(null);

  const { data, isLoading, isFetchingNextPage, isError, fetchNextPage } =
    useListProducts([user?.id], {
      uid: user?.id!,
    });

  useEffect(() => {
    if (data?.pages) {
      setPages(data.pages);
    }
  }, [data]);

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
    <main className='user-products__wrapper'>
      {pages && (
        <>
          {pages[0].products.length > 0 ? (
            <ProductList
              pages={pages}
              fetchNextPage={fetchNextPage}
              isFetchingNextPage={isFetchingNextPage}
            />
          ) : isOwnProfile ? (
            <>
              <p className='fc-light ta-center py-5'>
                <SearchX className='svg-64 mb-1' />
                <br />
                Még nem hírdettél meg terméket. <br />
                Kattints a gombra és töltsd fel első termékedet.
                <Link
                  to={ROUTES.SELL}
                  state={{ background: location }}
                  className='button primary  mt-1_5 w-fc mx-auto'>
                  <Tag />
                  Add el most!
                </Link>
              </p>
            </>
          ) : (
            <p className='fc-light ta-center py-5'>
              <SearchX className='svg-64 mb-1' />
              <br />
              {user?.username} még nem rendelkezik termékekkel. Térj vissza
              később.
            </p>
          )}
        </>
      )}
    </main>
  );
};

export default Products;
