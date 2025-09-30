import { useDeferredValue } from "react";
import { useCartSearch } from "../../hooks/cart/useSearchCart";

import PackageList from "./PackageList";

interface CartContentProps {
  searchKey: string;
}

const CartContent = ({ searchKey }: CartContentProps) => {
  const deferred = useDeferredValue(searchKey);
  const { filteredPackages, highlightIndex } = useCartSearch(deferred);

  return (
    <div className='cart__content'>
      <p className='fc-gray-700 mb-2'>
        <strong>Fontos!</strong> A kosárban lévő tételek nincsenek lefoglalva, a
        készlet változhat. <strong>Az árak tájékoztató jellegűek.</strong> Lépj
        kapcsolatba az eladóval most, és pontosítsátok a részleteket!
      </p>

      <PackageList
        filteredPackages={filteredPackages}
        highlightIndex={highlightIndex}
      />
    </div>
  );
};

export default CartContent;
