import "../../assets/css/cart.css";
import { Link } from "react-router";
import { ROUTES } from "../../routes/routes";
import { useTitle } from "react-use";
import { useCart } from "../../hooks/cart/useCart";
import { ENUM } from "../../utils/enum";
import { useState } from "react";

import Spinner from "../../components/Spinner";
import CartHeader from "./CartHeader";
import CartContent from "./CartContent";
import CartSummary from "./CartSummary";
import Back from "../../components/Back";
import Empty from "../../components/Empty";

import { ArrowUpRight, Globe } from "lucide-react";

const Cart = () => {
  useTitle(`Kosár - ${ENUM.BRAND.NAME}`);

  const { cart, isLoading } = useCart();

  const [searchKey, setSearchKey] = useState<string>("");

  if (isLoading) {
    return (
      <div className='relative py-5'>
        <Spinner />
      </div>
    );
  }

  return cart && cart.summary.itemsCount > 0 ? (
    <section className='cart'>
      <Back to={ROUTES.HOME} text='Vásárlás folytatása' className='link mb-1' />

      <CartHeader searchKey={searchKey} setSearchKey={setSearchKey} />
      <CartContent searchKey={searchKey} />
      <CartSummary />
    </section>
  ) : (
    <section className='cart empty'>
      <Back text='Vissza' className='link mb-1' />
      <CartHeader searchKey={searchKey} setSearchKey={setSearchKey} />

      <Empty
        title='A kosarad üres'
        description='Válogass több eladótól, kombináld a tételeket, és hozd létre a saját
            termékcsomagjaidat.'>
        <Link to={ROUTES.HOME} className='button primary w-fc mx-auto mb-1_5'>
          <Globe />
          Böngéssz a {ENUM.BRAND.WHERE}
        </Link>
        <Link
          to={ROUTES.HOME}
          target='_blank'
          className='link blue no-anim fw-600'>
          Tudj meg többet <ArrowUpRight />
        </Link>
      </Empty>
    </section>
  );
};

export default Cart;
