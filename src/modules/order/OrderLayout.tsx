import { Outlet } from "react-router";
import OrderProvider from "../../context/OrderProvider";

const OrderLayout = () => {
  return (
    <OrderProvider>
      <Outlet />
    </OrderProvider>
  );
};

export default OrderLayout;
