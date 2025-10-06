import { CartProductModel } from "../../models/cartModel";

import StateButton from "../../components/StateButton";

import { Mail, Trash } from "lucide-react";

interface PackageActionsProps {
  product: CartProductModel;
  // subtotal: number;
}

const PackageActions = ({ product }: PackageActionsProps) => {
  const handleCreateOrder = () => {
    return Promise.resolve();
  };

  return (
    <div className='pkg__actions'>
      <div>
        <StateButton
          className='primary md my-0'
          text='Kapcsolatfelvétel'
          onClick={handleCreateOrder}>
          <Mail />
        </StateButton>

        <StateButton
          className='secondary red md my-0'
          text='Csomag törlése'
          onClick={handleCreateOrder}>
          <Trash />
        </StateButton>
      </div>
      <div>
        <span className='discount'>47 691 Ft</span>
        <span className='price__original'>52 990 Ft</span>
      </div>
    </div>
  );
};

export default PackageActions;
