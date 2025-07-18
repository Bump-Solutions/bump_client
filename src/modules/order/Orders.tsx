import "../../assets/css/order.css";
import { useTitle } from "react-use";
import { OrdersPageModel } from "../../models/orderModel";
import { ENUM } from "../../utils/enum";
import { useListOrders } from "../../hooks/order/useListOrders";

import Spinner from "../../components/Spinner";
import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";

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
              <header className='orders__header'>
                <h1>Rendelések</h1>
                <p>
                  A rendelések listában követheted nyomon az aktív
                  adásvételeidet. A <i>Részletek</i> gombra kattintva további
                  információkat találsz a rendelésről. <br />
                  Az adás-vétel folyamatáról{" "}
                  <Link to='/' target='_blank' className='link no-anim gap-0'>
                    bővebben itt <ArrowUpRight className='svg-16 ml-0_25' />
                  </Link>{" "}
                  olvashatsz.
                </p>
              </header>
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
