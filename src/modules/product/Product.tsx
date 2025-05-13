import "../../assets/css/product.css";
import { useProduct } from "../../hooks/product/useProduct";

import { useTitle } from "react-use";

import Spinner from "../../components/Spinner";
import Back from "../../components/Back";
import ProductHeader from "./ProductHeader";
import Thumbnail from "./Thumbnail";
import ProductItemsCard from "./ProductItemsCard";

const Product = () => {
  const { product, isLoading, isError } = useProduct();

  useTitle(`${product ? product.title : "Termék"} - Bump`);

  if (isLoading) return <Spinner />;

  if (isError) return null;

  console.log(product);

  return (
    <section className='product'>
      <div className='product__wrapper'>
        <Back />
        <ProductHeader />
        <Thumbnail />
        <div className='product__content'>
          <div className='product__details'></div>
          <ProductItemsCard />
        </div>
      </div>
    </section>
  );
};

export default Product;
