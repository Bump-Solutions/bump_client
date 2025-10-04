import { Link } from "react-router";

import { ArrowUpRight } from "lucide-react";

const OrdersHeader = () => {
  return (
    <header className='orders__header'>
      <h1>Rendelések</h1>
      <p className='fc-gray-700 mb-2'>
        A rendelések listában követheted nyomon az{" "}
        <strong>aktív adásvételeidet</strong>. A <i>Részletek</i> gombra
        kattintva további információkat találsz a rendelésről. <br />
        Az adás-vétel folyamatáról{" "}
        <Link to='/' target='_blank' className='link no-anim gap-0'>
          bővebben itt <ArrowUpRight className='svg-16 ml-0_25' />
        </Link>{" "}
        olvashatsz.
      </p>
    </header>
  );
};

export default OrdersHeader;
