import { useRef } from "react";
import { useCart } from "../../hooks/cart/useCart";
import { motion } from "framer-motion";
import { useClickOutside } from "../../hooks/useClickOutside";

interface CartContextMenuProps {
  toggleContextMenu: (value?: boolean) => void;
}

const CartContextMenu = ({ toggleContextMenu }: CartContextMenuProps) => {
  const { cart } = useCart();

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
      }}></motion.div>
  );
};

export default CartContextMenu;
