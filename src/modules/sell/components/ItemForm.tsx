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
    const draft = form.getFieldValue("items.draft") ?? DEFAULT_DRAFT;
    const items = form.getFieldValue("items.items") ?? [];

    const count = draft.count;

    const handleAddItem = () => {
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
            errors: [issue.message],
            isTouched: true,
          }));
        });

        toast.error("Kérjük javítsd a hibás mezőket!");
        return;
      }

      // Ha valid, akkor kész SellItem
      const validItem = result.data as SellItem;

      // Új tételek létrehozása a count alapján
      const newItems = Array.from({ length: count }, () => validItem);

      // Frissíti a tömböt
      form.setFieldValue("items.items", [...items, ...newItems]);

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

        <FieldGroup columns={2} className='mt-0_5'>
          {/* --- Darabszám mező  --- */}
          <form.AppField name='items.draft.count'>
            {(field) => <field.Stepper min={1} max={20} step={1} />}
          </form.AppField>

          {/* --- Hozzáadás gomb --- */}
          <Button
            type='button'
            text='Hozzáadás'
            className='primary br-1 flex-1'>
            <CirclePlus />
          </Button>
        </FieldGroup>
      </div>
    );
  },
});

export default ItemForm;
