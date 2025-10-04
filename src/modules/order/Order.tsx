import { useParams } from "react-router";

const Order = () => {
  const { uuid } = useParams<{ uuid: string }>();

  return <div>{uuid}</div>;
};

export default Order;
