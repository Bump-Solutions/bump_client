import { Address } from "../../../types/address";
import { FormEvent } from "react";
import { useDeleteAddress } from "../../../hooks/address/useDeleteAddress";
import { useMounted } from "../../../hooks/useMounted";

import Button from "../../../components/Button";
import StateButton from "../../../components/StateButton";

import { Trash } from "lucide-react";

interface DeleteProps {
  address: Address;
  close: () => void;
}

const Delete = ({ address, close }: DeleteProps) => {
  const isMounted = useMounted();

  const deleteAddressMutation = useDeleteAddress(() => {
    setTimeout(() => {
      if (isMounted) {
        close();
      }
    }, 500);
  });

  const handleDelete = (e: FormEvent) => {
    e.preventDefault();

    if (!address) return;

    return deleteAddressMutation.mutateAsync(address.id);
  };

  return (
    <>
      <h1 className='modal__title'>
        🗑️ Biztosan törölni szeretnéd a(z)&nbsp;
        <span className='fc-blue-500'>"{address.name}"</span>&nbsp;címet?
      </h1>
      <div className='modal__content'>
        <p>
          A cím törlése véglegesen eltávolítja azt a lakcímeid közül. Ez a
          művelet nem vonható vissza.
        </p>
      </div>
      <div className='modal__actions'>
        <Button
          className='secondary'
          text='Mégsem'
          disabled={deleteAddressMutation.isPending}
          onClick={() => close()}
        />
        <StateButton
          className='secondary red'
          text='Törlés'
          onClick={handleDelete}>
          <Trash />
        </StateButton>
      </div>
    </>
  );
};

export default Delete;
