import "../../assets/css/product.css";
import { InventoryModel } from "../../models/productModel";
import { useListSavedProducts } from "../../hooks/product/useListSavedProducts";

import Spinner from "../../components/Spinner";
import ProductList from "./ProductList";

import { SearchX } from "lucide-react";
import Empty from "../../components/Empty";

const SavedProducts = () => {
  const { data, isLoading, isFetchingNextPage, isError, fetchNextPage } =
    useListSavedProducts();

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
    <main className='user-products__wrapper'>
      {pages.length > 0 && (
        <>
          {pages[0].products.length > 0 ? (
            <ProductList
              pages={pages}
              fetchNextPage={fetchNextPage}
              isFetchingNextPage={isFetchingNextPage}
            />
          ) : (
            <>
              <Empty
                icon={<SearchX className='svg-32' />}
                title='Még nem rendelkezel mentett termékekkel'
                description='Ha tetszik egy termék, mentsd el, hogy később visszatalálj rá.'
              />
            </>
          )}
        </>
      )}
    </main>
  );
};

export default SavedProducts;
