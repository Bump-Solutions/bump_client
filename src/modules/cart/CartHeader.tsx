import { useDeferredValue, useEffect, useRef } from "react";
import { useCart } from "../../hooks/cart/useCart";
import { useToggle } from "../../hooks/useToggle";
import { AnimatePresence } from "framer-motion";

import CartContextMenu from "./CartContextMenu";

import { EllipsisVertical, Search } from "lucide-react";

interface CartHeaderProps {
  searchKey: string;
  setSearchKey: (key: string) => void;
}

const CartHeader = ({ searchKey, setSearchKey }: CartHeaderProps) => {
  const searchRef = useRef<HTMLInputElement | null>(null);
  const { cart } = useCart();

  // (opcionális) eltoljuk a drága renderelést:
  const deferredSearchKey = useDeferredValue(searchKey);

  const [isContextMenuOpen, toggleContextMenu] = useToggle(false);

  useEffect(() => {
    document.body.style.overflow = isContextMenuOpen ? "hidden" : "auto";
    document.body.style.pointerEvents = isContextMenuOpen ? "none" : "auto";

    return () => {
      document.body.style.overflow = "auto";
      document.body.style.pointerEvents = "auto";
    };
  }, [isContextMenuOpen]);

  if (!cart) return null;

  return (
    <header className='cart__header'>
      <div>
        <h1>A Te kosarad</h1>
        {cart.packages.length > 0 && (
          <span className='badge fw-600'>{cart.packages.length} csomag</span>
        )}
      </div>

      {cart.packages.length > 0 && (
        <div>
          <div
            className='search-box'
            role='search'
            onClick={() => searchRef.current?.focus()}>
            <Search aria-hidden='true' />
            <input
              type='search'
              className='form-control'
              placeholder='Keresés a kosárban...'
              value={deferredSearchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              ref={searchRef}
            />
          </div>
          <span
            className='cart-actions'
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleContextMenu(true);
            }}>
            <EllipsisVertical strokeWidth={3} />
          </span>
        </div>
      )}

      {isContextMenuOpen && (
        <AnimatePresence mode='wait'>
          <CartContextMenu toggleContextMenu={toggleContextMenu} />
        </AnimatePresence>
      )}
    </header>
  );
};

export default CartHeader;
