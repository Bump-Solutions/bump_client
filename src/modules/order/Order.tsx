import "../../assets/css/order.css";
import { ENUM } from "../../utils/enum";
import { useOrder } from "../../hooks/order/useOrder";
import { useTitle } from "react-use";
import { displayUuid } from "../../utils/functions";

import Spinner from "../../components/Spinner";
import Back from "../../components/Back";

const Order = () => {
  const { order, isLoading } = useOrder();
  const pretty = displayUuid(order?.uuid || "");

  useTitle(`Rendelés ${pretty} - ${ENUM.BRAND.NAME}`);

  if (isLoading) return <Spinner />;

  return (
    <section className='order'>
      <Back text='Vissza a rendelésekhez' />
      <div>{JSON.stringify(order, null, 2)}</div>
    </section>
  );
};

export default Order;
