import { ROUTES } from "../../routes/routes";
import { ProductListModel } from "../../models/productModel";
import { useClickOutside } from "../../hooks/useClickOutside";
import { Link, useLocation, useNavigate } from "react-router";
import { useRef } from "react";
import { motion } from "framer-motion";

import { ArrowUpRight, Percent } from "lucide-react";

interface ProductContextMenuProps {
  product: ProductListModel;
  toggleContextMenu: (value?: boolean) => void;
  toggleDelete: (value?: boolean) => void;
}

const ProductContextMenu = ({
  product,
  toggleContextMenu,
  toggleDelete,
}: ProductContextMenuProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const ref = useRef<HTMLDivElement>(null);

  useClickOutside({
    ref: ref,
    callback: () => toggleContextMenu(false),
  });

  return (
    <motion.div
      ref={ref}
      className='product__menu-actions'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.2,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}>
      <ul className='action-list'>
        <li className='action-list-item blue icon-end'>
          <div>
            <ArrowUpRight />
            <span>Megosztás</span>
          </div>
        </li>
      </ul>

      {product.ownProduct && (
        <ul className='action-list'>
          <li className='action-list-item'>
            <div
              onClick={(e) => {
                e.preventDefault();
                toggleContextMenu(false);
                navigate(ROUTES.PRODUCT(product.id).DISCOUNT, {
                  state: { background: location },
                });
              }}>
              <Percent />
              <span>Kedvezmény</span>
            </div>
          </li>
        </ul>
      )}

      <ul className='action-list no-border'>
        {product.ownProduct ? (
          <>
            <li className='action-list-item'>
              <div>
                <span>Szerkesztés</span>
              </div>
            </li>

            <li className='action-list-item'>
              <div>
                <span>Archiválás</span>
              </div>
            </li>

            <li className='action-list-item red'>
              <div
                onClick={(e) => {
                  e.preventDefault();
                  toggleContextMenu(false);
                  toggleDelete(true);
                }}>
                <span>Törlés</span>
              </div>
            </li>
          </>
        ) : (
          <li className='action-list-item red'>
            <Link
              onClick={() => toggleContextMenu(false)}
              to={ROUTES.REPORT("product", product.id)}
              state={{ background: location }}>
              <span>Jelentés</span>
            </Link>
          </li>
        )}
      </ul>
    </motion.div>
  );
};

export default ProductContextMenu;
