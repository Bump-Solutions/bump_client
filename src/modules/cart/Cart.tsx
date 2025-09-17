import "../../assets/css/cart.css";
import { useTitle } from "react-use";
import { useCart } from "../../hooks/trade/useCart";
import { ENUM } from "../../utils/enum";

import Back from "../../components/Back";
import Button from "../../components/Button";

import { Globe } from "lucide-react";

const Cart = () => {
  useTitle(`Kosár - ${ENUM.BRAND.NAME}`);

  const { cart, cartItemCount } = useCart();

  console.log(cart);

  return cartItemCount > 0 ? (
    <section className='cart'>
      <Back text='Vásárlás folytatása' className='link mb-1' />
    </section>
  ) : (
    <section className='cart empty'>
      <h1>A kosarad üres.</h1>
      <Button className='primary' text='Böngéssz a Bumpon'>
        <Globe />
      </Button>
    </section>
  );
};

export default Cart;
