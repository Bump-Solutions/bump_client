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
import Button from "../../components/Button";
import OrdersHeader from "./OrdersHeader";
import OrdersDataTable from "../../datatables/OrdersDataTable";
import Empty from "../../components/Empty";

import { MessageCircleQuestion, PackageOpen, RotateCcw } from "lucide-react";

const DEFAULT_PAGE_SIZE = 10;

const Orders = () => {
  useTitle(`Rendelések - ${ENUM.BRAND.NAME}`);

  const axiosPrivate = useAxiosPrivate();

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);

  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery(
    listOrdersQueryOptions(axiosPrivate, page, pageSize)
  );

  useEffect(() => {
    if (data?.next) {
      queryClient.prefetchQuery(
        listOrdersQueryOptions(axiosPrivate, page + 1, pageSize)
      );
    }
  }, [page]);

  if (isError) {
    return (
      <div className='relative py-5'>
        <h4 className='fc-red-500 ta-center mb-1'>
          Hiba történt a rendelések betöltése közben.
          <br />
        </h4>
        <Button className='secondary mx-auto' onClick={() => refetch()}>
          <RotateCcw />
          Próbáld újra
        </Button>
      </div>
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
      {data && data.orders.length > 0 ? (
        <>
          <OrdersHeader />

          <OrdersDataTable
            data={data}
            pageSize={pageSize}
            pageIndex0={page - 1} // API -> UI normalizáció
            onPageChange={(nextIndex0: number, nextSize: number) => {
              setPage(nextIndex0 + 1); // UI -> API normalizáció
              setPageSize(nextSize);
            }}
          />
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
