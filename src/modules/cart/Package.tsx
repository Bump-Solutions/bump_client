import { ROUTES } from "../../routes/routes";
import { Link } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import { CartPackageModel, CartProductModel } from "../../models/cartModel";
import { highlightTextParts } from "../../utils/highlight";

import Image from "../../components/Image";
import PackageProduct from "./PackageProduct";

import { ChevronDown, ChevronUp } from "lucide-react";

interface PackageProps {
  pkg: CartPackageModel;
  expanded: boolean;
  onToggle: () => void;
  subtotal: number;
  highlightIndex?: Record<number, Record<string, [number, number][]>>; // itemId -> FieldMatches
}

const Package = ({
  pkg,
  expanded,
  onToggle,
  subtotal,
  highlightIndex,
}: PackageProps) => {
  const sid = pkg.seller.id;
  const btnId = `pkg-btn-${sid}`;
  const panelId = `pkg-panel-${sid}`;

  const firstProduct = Object.values(pkg.products)[0];
  const firstItem = firstProduct?.items[0];

  const sellerRanges = firstItem
    ? highlightIndex?.[firstItem.id]?.["sellerUsername"]
    : undefined;

  return (
    <li className={`pkg ${expanded ? "open" : ""}`}>
      <div className='pkg__header'>
        <button
          type='button'
          id={btnId}
          aria-expanded={expanded}
          aria-controls={panelId}
          onClick={onToggle}>
          <div className='pkg__seller__meta'>
            <Image
              src={pkg.seller.profilePicture!}
              alt={pkg.seller.username.slice(0, 2)}
              placeholderColor='#212529'
            />

            <div>
              <Link
                to={ROUTES.PROFILE(pkg.seller.username).ROOT}
                className='link black'
                target='_blank'
                onClick={(e) => e.stopPropagation()}>
                {highlightTextParts(pkg.seller.username, sellerRanges)}
              </Link>
              <span className='small'>
                {Object.keys(pkg.products).length} termék,{" "}
                {Object.values(pkg.products).reduce(
                  (acc, p) => acc + p.items.length,
                  0
                )}{" "}
                tétel
              </span>
            </div>
          </div>

          {expanded ? (
            <ChevronUp className='svg-20' />
          ) : (
            <ChevronDown className='svg-20' />
          )}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key='panel'
            id={panelId}
            role='region'
            aria-labelledby={btnId}
            className='pkg__panel'
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: 0.2,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            style={{ overflow: "hidden" }}
            layout>
            {Object.values(pkg.products).map((prod: CartProductModel) => (
              <PackageProduct
                key={prod.product.id}
                product={prod}
                highlightIndex={highlightIndex}
              />
            ))}

            {/* Csomag actions, pl: Kapcsolatfelvétel, Törlés ... */}
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
};

export default Package;
