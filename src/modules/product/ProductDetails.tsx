import { useProduct } from "../../hooks/product/useProduct";
import { BadgeCollection } from "../../types/product";
import Badges from "../../components/Badges";
import { useMemo, useState } from "react";

const BADGES: BadgeCollection = {
  discount: {
    text: "-10%",
    type: "discount",
    priority: 99,
  },
  new: {
    text: "Új",
    type: "new",
    priority: 98,
  },
  popular: {
    text: "Népszerű",
    type: "popular",
    priority: 97,
  },
  recommended: {
    text: "Ajánlott",
    type: "recommended",
    priority: 96,
  },
};

const ProductDetails = () => {
  const { product } = useProduct();
  if (!product) return null;

  const [selectedGender, setSelectedGender] = useState<number | null>(null);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedCondition, setSelectedCondition] = useState<number | null>(
    null
  );

  // Csak az elérhető (state=1) tételek
  const items = product.items || [];
  const availableItems = useMemo(
    () => items.filter((item) => item.state === 1),
    [items]
  );

  // Összesítés: darabszám, egységár, firstAvailableItemId
  const { availableCount, unitPrice, firstAvailableItemId } = useMemo(() => {
    if (
      selectedGender === null ||
      selectedSize === null ||
      selectedCondition === null
    ) {
      return { availableCount: 0, unitPrice: 0, firstAvailableItemId: null };
    }

    const filtered = availableItems
      .filter(
        (item) =>
          item.gender?.value === selectedGender &&
          item.size?.value === selectedSize &&
          item.condition?.value === selectedCondition
      )
      .sort((a, b) => a.id! - b.id!);

    if (filtered.length === 0) {
      return { availableCount: 0, unitPrice: 0, firstAvailableItemId: null };
    }

    const count = filtered.length;
    const minPrice = Math.min(...filtered.map((i) => i.price!));
    const firstId = filtered[0].id;

    return {
      availableCount: count,
      unitPrice: minPrice,
      firstAvailableItemId: firstId,
    };
  }, [availableItems, selectedGender, selectedSize, selectedCondition]);

  const LABEL =
    product.product.brand +
    " " +
    product.product.model +
    " " +
    product.product.color_way;

  return (
    <article className='product__details'>
      <Badges badges={BADGES} initialToggle={true} showToggle={false} />
      <h1 className='mb-0_5'>{LABEL}</h1>
      {product.description && (
        <p className='fc-light ta-justify'>{product.description}</p>
      )}
    </article>
  );
};

export default ProductDetails;
