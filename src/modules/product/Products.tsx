import "../../assets/css/product.css";
import { ROUTES } from "../../routes/routes";
import { InventoryModel } from "../../models/productModel";
import { Link, useLocation } from "react-router";
import { useProfile } from "../../hooks/profile/useProfile";
import { useListProducts } from "../../hooks/product/useListProducts";

import Spinner from "../../components/Spinner";
import ProductList from "./ProductList";

import { ArrowUpRight, SearchX, Tag } from "lucide-react";
import Empty from "../../components/Empty";

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
            <Empty
              icon={<SearchX className='svg-32' />}
              title='Még nem hírdettél meg terméket'
              description='Kattints a gombra és töltsd fel első termékedet most!'>
              <Link
                to={ROUTES.SELL}
                state={{ background: location }}
                className='button primary w-fc mx-auto mb-1_5'>
                <Tag />
                Add el most!
              </Link>
              <Link
                to={ROUTES.HOME}
                target='_blank'
                className='link blue no-anim fw-600'>
                Tudj meg többet <ArrowUpRight />
              </Link>
            </Empty>
          ) : (
            <Empty
              icon={<SearchX className='svg-32' />}
              title={`${user?.username} még nem rendelkezik termékekkel`}
              description='Kattints az értesítések gombra, hogy értesülj a legújabb
                  termékekről.'
            />
          )}
        </>
      )}
    </section>
  );
};

export default Products;
