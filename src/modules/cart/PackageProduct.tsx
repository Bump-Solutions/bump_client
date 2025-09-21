import { CartProductModel } from "../../models/cartModel";

interface PackageProductProps {
  product: CartProductModel;
  highlightIndex?: Record<number, Record<string, [number, number][]>>; // itemId -> FieldMatches
}

const PackageProduct = ({ product, highlightIndex }: PackageProductProps) => {
  return <section key={product.product.id}></section>;
};

export default PackageProduct;
