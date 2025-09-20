import { useRef } from "react";
import { useCart } from "../../hooks/trade/useCart";

import { Search } from "lucide-react";

const CartHeader = () => {
  const searchRef = useRef<HTMLInputElement | null>(null);

  const { cart } = useCart();

  return (
    <header className='cart__header'>
      <div>
        <h1>A Te kosarad</h1>
        {cart.summary.itemsCount > 0 && (
          <span className='badge fw-600'>{cart.summary.itemsCount} tétel</span>
        )}
      </div>
      <div className='search-box' onClick={() => searchRef.current?.focus()}>
        <Search />
        <input
          className='form-control'
          placeholder='Keresés...'
          ref={searchRef}
        />
      </div>
    </header>
  );
};

export default CartHeader;
