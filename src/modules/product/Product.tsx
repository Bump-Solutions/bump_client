import "../../assets/css/product.css";
import { useProduct } from "../../hooks/product/useProduct";

import { useTitle } from "react-use";

import Spinner from "../../components/Spinner";
import ProductHeader from "./ProductHeader";
import Thumbnail from "./Thumbnail";

import Back from "../../components/Back";

const Product = () => {
  const { product, isLoading, isError } = useProduct();

  useTitle(`${product ? product.title : "Termék"} - Bump`);

  if (isLoading) return <Spinner />;

  if (isError) return null;

  return (
    <section className='product'>
      <div className='product__wrapper'>
        <Back />

        <ProductHeader />

        <Thumbnail />
      </div>
    </section>
  );
};

export default Product;
