import "../../assets/css/product.css";
import { useProduct } from "../../hooks/product/useProduct";

import { useTitle } from "react-use";

import Spinner from "../../components/Spinner";
import Back from "../../components/Back";
import Thumbnail from "./Thumbnail";
import ProductDetails from "./ProductDetails";

const Product = () => {
  const { product, isLoading } = useProduct();

  useTitle(`${product ? product.title : "Termék"} - Bump`);

  if (isLoading) return <Spinner />;

  return (
    <section className='product'>
      <div className='product__wrapper'>
        <Back />
        <div className='product__content'>
          <Thumbnail />
          <ProductDetails />
        </div>
      </div>
    </section>
  );
};

export default Product;
