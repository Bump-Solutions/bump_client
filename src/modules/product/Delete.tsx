import { ProductListModel } from "../../models/productModel";
import { useDeleteProduct } from "../../hooks/product/useDeleteProduct";
import { MouseEvent, useEffect, useState } from "react";

import Button from "../../components/Button";
import Modal from "../../components/Modal";
import StateButton from "../../components/StateButton";
import Image from "../../components/Image";

import { Trash } from "lucide-react";

interface DeleteProps {
  product: ProductListModel;
  isOpen: boolean;
  close: () => void;
}

const Delete = ({ product, isOpen, close }: DeleteProps) => {
  const [currentProduct, setCurrentProduct] = useState<ProductListModel | null>(
    null
  );

  useEffect(() => {
    if (isOpen) {
      setCurrentProduct(product);
    }
  }, [isOpen]);

  const deleteProductMutation = useDeleteProduct((response) => {
    setTimeout(() => {
      close();
    }, 250);
  });

  const handleDelete = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (deleteProductMutation.isPending || !currentProduct) return;

    return deleteProductMutation.mutateAsync(currentProduct.id);
  };

  if (!currentProduct) return null;

  return (
    <Modal isOpen={isOpen} close={close} size='xsm' className='confirm-delete'>
      <div className='modal__content'>
        <Image src={currentProduct.images[0]} alt={currentProduct.title} />
        <p>
          Biztosan törlöd a(z){" "}
          <b className='fc-blue-500'>"{currentProduct.title}"</b> című
          hírdetésed?
        </p>
        <p>
          <b>Figyelem!</b> A termék törlésével az összes hozzá tartozó tétel (
          {currentProduct.itemsCount} db) is megszűnik!
        </p>
      </div>

      <div className='modal__actions'>
        <Button
          className='secondary'
          text='Mégsem'
          disabled={deleteProductMutation.isPending}
          onClick={close}
        />
        <StateButton
          className='secondary red'
          text='Igen, törlöm'
          onClick={handleDelete}>
          <Trash />
        </StateButton>
      </div>
    </Modal>
  );
};

export default Delete;
