import { ROUTES } from "../../routes/routes";
import { Link } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import { CartPackageModel, CartProductModel } from "../../models/cartModel";
import { HighlightIndex } from "../../utils/highlight";

import Image from "../../components/Image";
import Highlighted from "../../components/Highlighted";
import PackageProduct from "./PackageProduct";
import PackageActions from "./PackageActions";

import { ChevronDown, ChevronUp } from "lucide-react";

interface PackageProps {
  pkg: CartPackageModel;
  expanded: boolean;
  onToggle: () => void;
  highlightIndex?: HighlightIndex;
}

const Package = ({ pkg, expanded, onToggle, highlightIndex }: PackageProps) => {
  const sid = pkg.seller.id;
  const btnId = `pkg-btn-${sid}`;
  const panelId = `pkg-panel-${sid}`;

  const sellerRanges =
    highlightIndex?.perSeller?.[pkg.seller.id]?.sellerUsername;

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
            />

            <div>
              <Link
                to={ROUTES.PROFILE(pkg.seller.username).ROOT}
                className='link black'
                target='_blank'
                onClick={(e) => e.stopPropagation()}>
                <Highlighted text={pkg.seller.username} ranges={sellerRanges} />
              </Link>
              <span className='small'>
                {pkg.products.length} termék,{" "}
                {pkg.products.reduce((acc, p) => acc + p.items.length, 0)} tétel
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
            {pkg.products.map((prod: CartProductModel) => (
              <>
                <PackageProduct
                  key={prod.id}
                  product={prod}
                  highlightIndex={highlightIndex}
                />
                <PackageActions key={`actions-${prod.id}`} product={prod} />
              </>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
};

export default Package;
