interface OrderHeaderProps {
  pretty: string;
}

const OrderHeader = ({ pretty }: OrderHeaderProps) => {
  return (
    <header className='order__header'>
      <h1>
        Rendelés <b className='fc-blue-500 fw-700'>{pretty}</b>
      </h1>
    </header>
  );
};

export default OrderHeader;
