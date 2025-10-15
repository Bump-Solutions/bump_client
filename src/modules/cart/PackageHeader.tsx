import { usePackage } from "../../hooks/cart/usePackage";
import { highlightTextParts } from "../../utils/highlight";

const PackageHeader = () => {
  const { pkg, highlightIndex } = usePackage();

  const seller = pkg.seller;
  const ranges = highlightIndex?.perSeller?.[seller.id]?.sellerUsername ?? [];

  const productCount = pkg.products.length;
  const itemsCount = pkg.products.reduce(
    (acc, product) => acc + product.items.length,
    0
  );

  return (
    <header className='package__header'>
      <div>{highlightTextParts(seller.username, ranges)}</div>
    </header>
  );
};

export default PackageHeader;
