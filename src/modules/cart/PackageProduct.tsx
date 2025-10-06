import Image from "../../components/Image";
import { CartProductModel } from "../../models/cartModel";
import { HighlightIndex } from "../../utils/highlight";

interface PackageProductProps {
  product: CartProductModel;
  highlightIndex?: HighlightIndex;
}

const PackageProduct = ({ product, highlightIndex }: PackageProductProps) => {
  return (
    <section className='pkg__product'>
      <Image src={product.image} alt={product.title} />
    </section>
  );
};

export default PackageProduct;
