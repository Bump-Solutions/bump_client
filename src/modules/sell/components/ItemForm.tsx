import { useState } from "react";
import { toast } from "sonner";
import { Option } from "../../../components/Select";
import { withForm } from "../../../hooks/form/hooks";
import { itemSchema, SellItem } from "../../../schemas/sellSchema";
import { sellFormOptions } from "../../../utils/formOptions";

type DraftItem = {
  gender: Option<number> | null;
  size: Option<number> | null;
  condition: Option<number> | null;
  price: number | null;
};

type DraftErrors = Partial<Record<keyof DraftItem, string>>;

const INITIAL_ITEM: DraftItem = {
  gender: null,
  size: null,
  condition: null,
  price: null,
};

const ItemForm = withForm({
  ...sellFormOptions,
  render: function Render({ form }) {
    const [item, setItem] = useState<DraftItem>(INITIAL_ITEM);
    const [errors, setErrors] = useState<DraftErrors>({});
    const [count, setCount] = useState<number>(1);
    const [formKey, setFormKey] = useState(0); // Key to force re-render Select components

    const setFieldError = (name: keyof DraftItem, message?: string) => {
      setErrors((prev) => ({
        ...prev,
        [name]: message ?? "",
      }));
    };

    const handleChangeSelect = (
      name: keyof DraftItem,
      option: Option | Option[] | null
    ) => {
      setItem((prev) => ({
        ...prev,
        [name]: option as Option<number> | null,
      }));

      setFieldError(name, "");
    };

    const handleChangePrice = (value: number) => {
      setItem((prev) => ({
        ...prev,
        price: value,
      }));

      setFieldError("price", "");
    };

    const handleAddItem = () => {
      const candidate = {
        gender: item.gender?.value,
        size: item.size?.value,
        condition: item.condition?.value,
        price: item.price ?? NaN,
      };

      const result = itemSchema.safeParse(candidate);

      if (!result.success) {
        const fieldErrors: DraftErrors = {};

        for (const issue of result.error.issues) {
          const field = issue.path[0] as keyof typeof candidate;
          const msg = issue.message;

          switch (field) {
            case "gender":
              fieldErrors.gender = msg;
              break;

            case "size":
              fieldErrors.size = msg;
              break;

            case "condition":
              fieldErrors.condition = msg;
              break;

            case "price":
              fieldErrors.price = msg;
              break;

            default:
              break;
          }

          setErrors((prev) => ({ ...prev, ...fieldErrors }));
          toast.error("Kérjük töltsd ki a csillaggal jelölt mezőket!");
          return;
        }
      }

      const validItem = result.data as SellItem;

      const currentItems =
        (form.getFieldValue("items.items") as
          | (typeof validItem)[]
          | undefined) ?? [];

      const newItems = Array.from({ length: count }, () => validItem);

      form.setFieldValue("items.items", [...currentItems, ...newItems]);

      form.setFieldMeta("items.items", (prev: any) => ({
        ...prev,
        isTouched: true,
      }));
      form.validateField("items.items", "change");

      // Reset
      setItem(INITIAL_ITEM);
      setErrors({});
      setCount(1);
      setFormKey((prev) => prev + 1);
    };

    return <div className='item__column'>Item Form Content</div>;
  },
});

export default ItemForm;
