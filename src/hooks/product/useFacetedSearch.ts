import { useMemo, useState } from "react";
import { useProduct } from "./useProduct";
import { ProductModel } from "../../models/productModel";

export interface FacetProps {
  quantity: number;
  genders: number[];
  sizes: number[];
  conditions: number[];

  selectedGender: number | null;
  selectedSize: number | null;
  selectedCondition: number | null;

  setQuantity: (value: number) => void;
  setGender: (value: number) => void;
  setSize: (value: number) => void;
  setCondition: (value: number) => void;

  available: ProductModel["items"]; // All available items (state === 1)
  filtered: ProductModel["items"] | null; // Filtered items based on selected facets

  filteredCount: number;
  filteredMinPrice: number | null;
  firstFilteredItemId: number | null;
}

export const useFacetedSearch = (): FacetProps | null => {
  const { product } = useProduct();
  if (!product) return null;

  const items = product.items || [];
  const available = useMemo(() => items.filter((i) => i.state === 1), [items]);
  if (available.length === 0) return null;

  const [quantity, setQuantity] = useState<number>(1);
  const [gender, setGender] = useState<number | null>(null);
  const [size, setSize] = useState<number | null>(null);
  const [condition, setCondition] = useState<number | null>(null);

  const genders = useMemo(() => {
    const unique = new Set(available.map((i) => i.gender));
    return Array.from(unique).sort();
  }, [available]);

  const sizes = useMemo(() => {
    if (gender === null) return [];

    const filtered = available.filter((i) => i.gender === gender);
    const unique = new Set(filtered.map((i) => Number(i.size)));

    return Array.from(unique).sort((a, b) => a - b);
  }, [available, gender]);

  const conditions = useMemo(() => {
    if (gender === null || size === null) return [];

    const filtered = available.filter(
      (i) => i.gender === gender && Number(i.size) === size
    );
    const unique = new Set(filtered.map((i) => i.condition));

    return Array.from(unique).sort();
  }, [available, gender, size]);

  // Summary: count, filteredMinPrice, firstFilteredItemId
  const { filtered, filteredCount, filteredMinPrice, firstFilteredItemId } =
    useMemo(() => {
      if (gender === null || size === null || condition === null) {
        return {
          filtered: null,
          filteredCount: 0,
          filteredMinPrice: null,
          firstFilteredItemId: null,
        };
      }

      const filtered = available
        .filter(
          (i) =>
            i.gender === gender &&
            Number(i.size) === size &&
            i.condition === condition
        )
        .sort((a, b) => a.id - b.id);

      if (filtered.length === 0) {
        return {
          filtered: null,
          filteredCount: 0,
          filteredMinPrice: null,
          firstFilteredItemId: null,
        };
      }

      const count = filtered.length;
      const minPrice = Math.min(...filtered.map((i) => i.price));
      const firstId = filtered[0].id;

      return {
        filtered: filtered,
        filteredCount: count,
        filteredMinPrice: minPrice,
        firstFilteredItemId: firstId,
      };
    }, [available, gender, size, condition]);

  const handleSelectGender = (value: number) => {
    setGender(value);
    setSize(null);
    setCondition(null);
    setQuantity(1);
  };

  const handleSelectSize = (value: number) => {
    setSize(value);
    setCondition(null);
    setQuantity(1);
  };

  return {
    quantity,
    genders,
    sizes,
    conditions,

    selectedGender: gender,
    selectedSize: size,
    selectedCondition: condition,

    setQuantity: setQuantity,
    setGender: handleSelectGender,
    setSize: handleSelectSize,
    setCondition: setCondition,

    available,
    filtered,

    filteredCount,
    filteredMinPrice,
    firstFilteredItemId,
  };
};
