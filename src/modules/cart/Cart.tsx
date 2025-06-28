import "../../assets/css/cart.css";
import { useTitle } from "react-use";
import { useCart } from "../../hooks/trade/useCart";
import { ENUM } from "../../utils/enum";

import Back from "../../components/Back";

const Cart = () => {
  useTitle(`Kosár - ${ENUM.BRAND.NAME}`);

  const { cart, cartItemCount } = useCart();

  console.log(cart);

  return (
    <section className='cart'>
      {cartItemCount > 0 ? (
        <>
          <Back text='Vásárlás folytatása' className='link mb-1' />
        </>
      ) : (
        <div></div>
      )}
    </section>
  );
};

export default Cart;
