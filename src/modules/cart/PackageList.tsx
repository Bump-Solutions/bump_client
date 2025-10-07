import { useDeferredValue } from "react";
import { useCartSearch } from "../../hooks/cart/useSearchCart";

import Package from "./Package";

interface PackageListProps {
  searchKey: string;
}

const PackageList = ({ searchKey }: PackageListProps) => {
  const deferred = useDeferredValue(searchKey);
  const { filteredPackages, highlightIndex } = useCartSearch(deferred);

  return (
    <ul className='package__list'>
      {filteredPackages.map((pkg) => {
        const sid = pkg.seller.id;

        return <Package key={sid} pkg={pkg} highlightIndex={highlightIndex} />;
      })}
    </ul>
  );
};

export default PackageList;
