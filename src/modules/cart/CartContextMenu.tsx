import { useRef } from "react";
import { useCart } from "../../hooks/cart/useCart";
import { motion } from "framer-motion";
import { useClickOutside } from "../../hooks/useClickOutside";

import { ArrowUpRight } from "lucide-react";

interface CartContextMenuProps {
  toggleContextMenu: (value?: boolean) => void;
}

const CartContextMenu = ({ toggleContextMenu }: CartContextMenuProps) => {
  const { cart, clearCart } = useCart();

  const ref = useRef<HTMLDivElement>(null);

  useClickOutside({
    ref: ref,
    callback: () => toggleContextMenu(false),
  });

  return (
    <motion.div
      ref={ref}
      className='cart__menu-actions'
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

      <ul className='action-list no-border'>
        <li className='action-list-item red '>
          <div
            onClick={(e) => {
              e.preventDefault();
              clearCart();
              toggleContextMenu(false);
            }}>
            <span>Kosár ürítése</span>
          </div>
        </li>
      </ul>
    </motion.div>
  );
};

export default CartContextMenu;
