import { useStore } from "@tanstack/react-form";
import { CirclePlus } from "lucide-react";
import { toast } from "sonner";
import Button from "../../../components/Button";
import FieldGroup from "../../../components/form/FieldGroup";
import { withForm } from "../../../hooks/form/hooks";
import { itemSchema, SellItem } from "../../../schemas/sellSchema";
import { ENUM } from "../../../utils/enum";
import { sellFormOptions } from "../../../utils/formOptions";

const DEFAULT_DRAFT = {
  gender: null,
  size: null,
  condition: null,
  price: null,
  count: 1,
};

const ItemForm = withForm({
  ...sellFormOptions,
  render: function Render({ form }) {
    const items =
      (useStore(
        form.store,
        (state) => state.values.items.items,
      ) as SellItem[]) ?? [];

    const handleAddItem = () => {
      const draft = form.getFieldValue("items.draft") ?? DEFAULT_DRAFT;
      const count = draft.count;

      // Candidate objektum validációhoz
      const candidate = {
        gender: draft.gender ?? null,
        size: draft.size ?? null,
        condition: draft.condition ?? null,
        price: draft.price ?? null,
      };

      const result = itemSchema.safeParse(candidate);
      if (!result.success) {
        result.error.issues.forEach((issue) => {
          const fieldName = issue.path[0] as keyof typeof draft;

          form.setFieldMeta(`items.draft.${fieldName}`, (prev) => ({
            ...prev,
            isTouched: true,
          }));

          form.validateField(`items.draft.${fieldName}`, "change");
        });

        toast.error("Kérjük javítsd a hibás mezőket!");
        return;
      }

      const validItem = result.data as SellItem; // Ha valid, akkor kész SellItem
      const newItems = Array.from({ length: count }, () => validItem); // Új tételek létrehozása a count alapján

      // Frissíti a tömböt
      form.setFieldValue("items.items", [...items, ...newItems]);

      // Reset
      form.resetField("items.draft.gender");
      form.resetField("items.draft.size");
      form.resetField("items.draft.condition");
      form.resetField("items.draft.price");
      form.resetField("items.draft.count");

      // Visszaállítja a draftot
      form.setFieldValue("items.draft", DEFAULT_DRAFT);
    };

    return (
      <div className='item__column'>
        {/* --- Nem mező --- */}
        <form.AppField
          name='items.draft.gender'
          validators={{ onChange: itemSchema.shape.gender }}>
          {(field) => (
            <field.Select
              label='Nem'
              options={ENUM.PRODUCT.GENDER_OPTIONS}
              required
            />
          )}
        </form.AppField>

        {/* --- Méret mező --- */}
        <form.AppField
          name='items.draft.size'
          validators={{ onChange: itemSchema.shape.size }}>
          {(field) => (
            <field.Select
              label='Méret'
              isSearchable
              options={ENUM.PRODUCT.SIZE_OPTIONS}
              required
            />
          )}
        </form.AppField>

        {/* --- Állapot mező --- */}
        <form.AppField
          name='items.draft.condition'
          validators={{ onChange: itemSchema.shape.condition }}>
          {(field) => (
            <field.Select
              label='Állapot'
              options={ENUM.PRODUCT.CONDITION_OPTIONS}
              required
            />
          )}
        </form.AppField>

        {/* --- Ár mező --- */}
        <form.AppField
          name='items.draft.price'
          validators={{ onChange: itemSchema.shape.price }}>
          {(field) => (
            <field.Currency
              label='Ár'
              required
              maxValue={99_999_999}
              suffix='HUF'
              placeholder='52 999'
            />
          )}
        </form.AppField>

        <FieldGroup columns={2} className='mt-0_5'>
          {/* --- Darabszám mező  --- */}
          <form.AppField name='items.draft.count'>
            {(field) => <field.Stepper min={1} max={20} step={1} />}
          </form.AppField>

          {/* --- Hozzáadás gomb --- */}
          <Button
            type='button'
            text='Hozzáadás'
            className='primary br-1 flex-1'
            onClick={handleAddItem}>
            <CirclePlus />
          </Button>
        </FieldGroup>
      </div>
    );
  },
});

export default ItemForm;
