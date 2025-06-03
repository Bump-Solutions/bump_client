import { forwardRef, useImperativeHandle } from "react";
import { useToast } from "../../../hooks/useToast";
import { useSell } from "../../../hooks/product/useSell";

import ItemForm from "./ItemForm";
import ItemsList from "./ItemsList";

interface ItemsStepRef {
  isValid: () => boolean;
}

const ItemsStep = forwardRef<ItemsStepRef>(({}, ref) => {
  const { addToast } = useToast();

  const { data, setErrors } = useSell();

  useImperativeHandle(ref, () => ({ isValid }));

  const isValid = () => {
    if (data.items.length === 0) {
      setErrors((prev) => ({
        ...prev,
        items: "A mező kitöltése kötelező.",
      }));
      addToast("error", "Kérjük adj hozzá legalább egy tételt!");
      return false;
    }

    return true;
  };

  return (
    <div className='items__wrapper'>
      <ItemForm />
      <div className='divider' />
      <ItemsList />
    </div>
  );
});

export default ItemsStep;
