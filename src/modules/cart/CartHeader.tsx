import { useDeferredValue, useRef } from "react";
import { useCart } from "../../hooks/cart/useCart";
import { useToggle } from "../../hooks/useToggle";
import { AnimatePresence } from "framer-motion";

import { EllipsisVertical, Search } from "lucide-react";
import CartContextMenu from "./CartContextMenu";

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

  return (
    <>
      <header className='cart__header'>
        <div>
          <h1>A Te kosarad</h1>
          {cart.summary.itemsCount > 0 && (
            <span className='badge fw-600'>
              {cart.summary.itemsCount} tétel
            </span>
          )}
        </div>
        <div>
          <div
            className='search-box'
            role='search'
            onClick={() => searchRef.current?.focus()}>
            <Search aria-hidden='true' />
            <input
              type='search'
              className='form-control'
              placeholder='Keresés...'
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
      </header>

      {isContextMenuOpen && (
        <AnimatePresence mode='wait'>
          <CartContextMenu toggleContextMenu={toggleContextMenu} />
        </AnimatePresence>
      )}
    </>
  );
};

export default CartHeader;
