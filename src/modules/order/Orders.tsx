import "../../assets/css/order.css";
import { useTitle } from "react-use";
import { Link } from "react-router";
import { ROUTES } from "../../routes/routes";
import { useAxiosPrivate } from "../../hooks/auth/useAxiosPrivate";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { listOrdersQueryOptions } from "../../utils/queryOptions";
import { useEffect, useState } from "react";
import { ENUM } from "../../utils/enum";

import Spinner from "../../components/Spinner";
import OrdersHeader from "./OrdersHeader";
import OrdersDataTable from "../../datatables/OrdersDataTable";

import { MessageCircleQuestion, PackageOpen } from "lucide-react";
import Empty from "../../components/Empty";

const Orders = () => {
  useTitle(`Rendelések - ${ENUM.BRAND.NAME}`);

  const axiosPrivate = useAxiosPrivate();

  const [page, setPage] = useState<number>(1);
  const { data, isLoading, isError, refetch } = useQuery(
    listOrdersQueryOptions(axiosPrivate, page)
  );

  const queryClient = useQueryClient();
  useEffect(() => {
    queryClient.prefetchQuery(listOrdersQueryOptions(axiosPrivate, page + 1));
  }, [page]);

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
      {data && data.orders.length < 0 ? (
        <>
          <OrdersHeader />

          <OrdersDataTable data={data} />
        </>
      ) : (
        <Empty
          icon={<PackageOpen className='svg-40' />}
          title='Nincsenek rendelések'
          description='Amikor létrejön egy új rendelés, láthatod az állapotát, és elérsz
              minden fontos információt. Kattints a lenti gombra és tudj meg
              mindent a rendelés menetéről!'>
          <Link to={ROUTES.HOME} className='button primary w-fc mx-auto fw-600'>
            <MessageCircleQuestion />
            Hogyan működik a rendelés?
          </Link>
        </Empty>
      )}
    </section>
  );
};

export default Orders;
