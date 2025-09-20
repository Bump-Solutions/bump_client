import "../../assets/css/cart.css";
import { Link } from "react-router";
import { ROUTES } from "../../routes/routes";
import { useTitle } from "react-use";
import { useCart } from "../../hooks/trade/useCart";
import { ENUM } from "../../utils/enum";

import CartHeader from "./CartHeader";
import CartContent from "./CartContent";
import CartSummary from "./CartSummary";
import Back from "../../components/Back";

import { Globe } from "lucide-react";

const Cart = () => {
  useTitle(`Kosár - ${ENUM.BRAND.NAME}`);

  const { cart } = useCart();

  return cart.summary.itemsCount > 0 ? (
    <section className='cart'>
      <Back to={ROUTES.HOME} text='Vásárlás folytatása' className='link mb-1' />

      <CartHeader />
      <CartContent />
      <CartSummary />
    </section>
  ) : (
    <section className='cart empty'>
      <Back text='Vissza' className='link mb-1' />
      <CartHeader />

      <div className='fc-gray-600 ta-center pt-3 px-5 pb-5 d-flex flex-column a-center gap-1'>
        <div className='ta-center'>
          <h4 className='fw-600 mb-0_25 fs-18'>A kosarad üres</h4>
          <p className='fc-gray-600 fs-16'>
            Válogass több eladótól, kombináld a tételeket, és hozd létre a saját
            termékcsomagjaidat.
          </p>
        </div>
        <Link to={ROUTES.HOME} className='button primary w-fc mx-auto'>
          <Globe />
          Böngéssz a {ENUM.BRAND.WHERE}
        </Link>
      </div>
    </section>
  );
};

export default Cart;
