import { ENUM } from "../../../utils/enum";
import { Errors, Option } from "../../../types/form";
import { useState } from "react";
import { useSell } from "../../../hooks/product/useSell";
import { useDebounce } from "../../../hooks/useDebounce";
import { toast } from "sonner";

import Currency from "../../../components/Currency";
import Select from "../../../components/Select";
import Button from "../../../components/Button";
import Stepper from "../../../components/Stepper";

import { CirclePlus } from "lucide-react";

interface FormItem {
  condition: Option<number> | null;
  gender: Option<number> | null;
  size: Option<number> | null;
  price: number | null;
}

const INITIAL_ITEM: FormItem = {
  gender: null,
  size: null,
  condition: null,
  price: null,
};

const ItemForm = () => {
  const { data, updateData } = useSell();

  const [item, setItem] = useState<FormItem>(INITIAL_ITEM);
  const [count, setCount] = useState<number>(1);
  const [formKey, setFormKey] = useState(0); // Kulcs a Select újrarendereléshez
  const [errors, setErrors] = useState<Errors>({});

  useDebounce(
    () => {
      setErrors((prevErrors) => ({
        ...prevErrors,
        gender: "",
      }));
    },
    0,
    [item.gender]
  );

  useDebounce(
    () => {
      setErrors((prevErrors) => ({
        ...prevErrors,
        size: "",
      }));
    },
    0,
    [item.size]
  );

  useDebounce(
    () => {
      setErrors((prevErrors) => ({
        ...prevErrors,
        condition: "",
      }));
    },
    0,
    [item.condition]
  );

  const handleChangeSelect = (
    name: keyof FormItem,
    option: Option | Option[] | null
  ) => {
    setItem((prev) => ({
      ...prev,
      [name]: option,
    }));
  };

  useDebounce(
    () => {
      setErrors((prevErrors) => ({
        ...prevErrors,
        price: "",
      }));
    },
    0,
    [item.price]
  );

  const handleAddItem = (item: FormItem) => {
    const inputFields = { ...item };

    const emptyInputs = Object.keys(inputFields).filter(
      (key) => inputFields[key as keyof FormItem] === null
    );

    if (emptyInputs.length > 0) {
      emptyInputs.forEach((key) => {
        setErrors((prev) => ({
          ...prev,
          [key]: "A mező kitöltése kötelező.",
        }));
      });

      toast.error("Kérjük töltsd ki a csillaggal jelölt mezőket!");

      return;
    }

    if (Object.values(errors).some((x) => x !== "")) {
      toast.error("Kérjük javítsd a hibás mezőket!");
      return;
    }

    const newItems = Array.from({ length: count }, () => ({ ...item }));

    updateData({
      items: [...data.items, ...newItems],
    });

    setItem(INITIAL_ITEM);
    setCount(1);
    setFormKey((prevKey) => prevKey + 1);
  };

  return (
    <div className='item__column'>
      <Select
        key={`gender-${formKey}`}
        name='pr_gender'
        className='mt-0'
        required
        value={item?.gender}
        label='Nem'
        options={ENUM.PRODUCT.GENDER_OPTIONS}
        placeholder='Válassz az alábbiak közül...'
        onChange={(option) => handleChangeSelect("gender", option)}
        error={errors.gender}
      />
      <Select
        key={`size-${formKey}`}
        name='pr_size'
        isSearchable
        required
        value={item?.size}
        label='Méret'
        options={ENUM.PRODUCT.SIZE_OPTIONS}
        placeholder='Válassz az alábbiak közül...'
        onChange={(option) => handleChangeSelect("size", option)}
        error={errors.size}
      />
      <Select
        key={`condition-${formKey}`}
        name='pr_condition'
        required
        value={item?.condition}
        label='Állapot'
        options={ENUM.PRODUCT.CONDITION_OPTIONS}
        placeholder='Válassz az alábbiak közül...'
        onChange={(option) => handleChangeSelect("condition", option)}
        error={errors.condition}
      />
      <Currency
        name='pr_price'
        type='text'
        required
        label='Ár'
        maxValue={99999999} // 99 999 999
        value={item?.price}
        suffix='HUF'
        onChange={(value: number) =>
          setItem((prev) => ({ ...prev, price: value }))
        }
        placeholder='52 990'
        error={errors.price}
      />

      <div className='field__wrapper gap-1 mt-1'>
        <Stepper
          value={count}
          min={1}
          max={20}
          step={1}
          onChange={(value: number) => setCount(value)}
        />

        <Button
          type='button'
          text='Hozzáadás'
          className='primary br-1 flex-1'
          onClick={() => handleAddItem(item)}>
          <CirclePlus />
        </Button>
      </div>
    </div>
  );
};

export default ItemForm;
