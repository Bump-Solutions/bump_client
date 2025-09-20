import { useCart } from "../../hooks/trade/useCart";

const CartContent = () => {
  const { cart } = useCart();

  console.log(cart);

  return <div className='cart__content'></div>;
};

export default CartContent;
