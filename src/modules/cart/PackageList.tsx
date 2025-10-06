import { useMemo, useState } from "react";
import { HighlightIndex } from "../../utils/highlight";
import { CartPackageModel } from "../../models/cartModel";

import Package from "./Package";
import Button from "../../components/Button";

import { ChevronsDown, ChevronsUp } from "lucide-react";

interface PackageListProps {
  filteredPackages: CartPackageModel[];
  highlightIndex?: HighlightIndex;
}

const PackageList = ({
  filteredPackages,
  highlightIndex,
}: PackageListProps) => {
  // render input: package-ek rendezve seller név szerint (opcionális)
  const packages = useMemo(
    () =>
      [...filteredPackages].sort((a, b) =>
        a.seller.username.localeCompare(b.seller.username, "hu")
      ),
    [filteredPackages]
  );

  const allIds = useMemo(() => packages.map((p) => p.seller.id), [packages]);
  // nyitott csomagok (sellerId-k halmaza)
  const [open, setOpen] = useState<Set<number>>(new Set(allIds));

  const toggle = (sellerId: number) => {
    setOpen((prev) => {
      const next = new Set(prev);
      next.has(sellerId) ? next.delete(sellerId) : next.add(sellerId);
      return next;
    });
  };

  const expandAll = () => setOpen(new Set(allIds));
  const collapseAll = () => setOpen(new Set());

  return (
    <>
      <div className='pkg__bulk'>
        <Button
          type='button'
          onClick={expandAll}
          className='tertiary sm no-anim'>
          Mindet kinyit
          <ChevronsDown />
        </Button>
        <Button
          type='button'
          onClick={collapseAll}
          className='tertiary sm no-anim'>
          Mindet becsuk
          <ChevronsUp />
        </Button>
      </div>

      <ul className='package__list'>
        {packages.map((pkg) => {
          const sid = pkg.seller.id;
          return (
            <Package
              key={sid}
              pkg={pkg}
              expanded={open.has(sid)}
              onToggle={() => toggle(sid)}
              highlightIndex={highlightIndex}
            />
          );
        })}
      </ul>
    </>
  );
};

export default PackageList;
