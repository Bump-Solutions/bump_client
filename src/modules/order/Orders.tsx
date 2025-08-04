import "../../assets/css/order.css";
import { useTitle } from "react-use";

import { OrdersPageModel } from "../../models/orderModel";
import { ENUM } from "../../utils/enum";
import { useListOrders } from "../../hooks/order/useListOrders";

import Spinner from "../../components/Spinner";
import OrdersHeader from "./OrdersHeader";

const Orders = () => {
  useTitle(`Rendelések - ${ENUM.BRAND.NAME}`);

  const { data, isLoading, isFetchingNextPage, isError, fetchNextPage } =
    useListOrders();

  const pages: OrdersPageModel[] = data?.pages || [];

  console.log("Orders data:", data);

  if (isError) {
    return (
      <h4 className='fc-red-500 ta-center py-5'>
        Hiba történt a rendelések betöltése közben.
      </h4>
    );
  }

  if (isLoading) {
    return (
      <div className='relative py-5'>
        <Spinner />
      </div>
    );
  }

  return (
    <section className='orders'>
      {pages.length > 0 && (
        <>
          {pages[0].orders.length > 0 ? (
            <>
              <OrdersHeader />
            </>
          ) : (
            <></>
          )}
        </>
      )}
    </section>
  );
};

export default Orders;
