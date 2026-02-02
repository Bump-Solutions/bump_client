import { useStore } from "@tanstack/react-form";
import { Trash } from "lucide-react";
import { withForm } from "../../../hooks/form/hooks";
import { SellItem, sellItemsSchema } from "../../../schemas/sellSchema";
import { ENUM } from "../../../utils/enum";
import { sellFormOptions } from "../../../utils/formOptions";

const findLabel = (options: any[], value: number) =>
  options.find((opt) => opt.value === value)?.label || "-";

const ItemsList = withForm({
  ...sellFormOptions,
  render: function Render({ form }) {
    const items =
      (useStore(
        form.store,
        (state) => state.values.items.items,
      ) as SellItem[]) ?? [];

    const error = useStore(form.store, (state) => {
      const meta = state.fieldMeta["items.items"];
      if (!meta || !meta.isTouched || meta.isValid) return undefined;

      const errorMap = meta.errorMap ?? {};
      const fromSubmit = errorMap.onSubmit ?? [];

      const allErrors = [
        ...(Array.isArray(fromSubmit) ? fromSubmit : [fromSubmit]),
      ].filter(Boolean);

      const first = allErrors[0];
      if (!first) return undefined;

      return typeof first === "string" ? first : first.message;
    });

    const groupedItems = items.reduce(
      (acc: any, item: any) => {
        const key = `${item.gender}-${item.size}-${item.condition}-${item.price}`;

        if (acc[key]) {
          acc[key].count += 1;
        } else {
          acc[key] = {
            key,
            ...item,
            count: 1,
          };
        }

        return acc;
      },
      {} as Record<string, any>,
    );

    const handleRemoveItem = (item: any) => {
      const filtered = items.filter((i) => {
        const key = `${i.gender}-${i.size}-${i.condition}-${i.price}`;
        return key !== item.key;
      });

      form.setFieldValue("items.items", filtered);
      form.validateField("items.items", "change");

      if (filtered.length === 0) {
        form.resetField("items.items");
      }
    };

    return (
      <div className='item__column'>
        <form.AppField
          name='items.items'
          validators={{ onChange: sellItemsSchema.shape.items.shape.items }}>
          {() => null}
        </form.AppField>

        <table>
          <thead>
            <tr>
              <th>Nem</th>
              <th>Méret</th>
              <th>Állapot</th>
              <th>Ár</th>
              <th className='ta-right'>Darabszám</th>
              <th />
            </tr>
          </thead>

          <tbody>
            {Object.keys(groupedItems).length === 0 ? (
              <tr>
                <td colSpan={6} className='empty'>
                  Nincsenek hozzáadott tételek.
                </td>
              </tr>
            ) : (
              Object.values(groupedItems).map((item: any) => (
                <tr key={item.key}>
                  <td>{findLabel(ENUM.PRODUCT.GENDER_OPTIONS, item.gender)}</td>
                  <td>{findLabel(ENUM.PRODUCT.SIZE_OPTIONS, item.size)}</td>
                  <td>
                    {findLabel(ENUM.PRODUCT.CONDITION_OPTIONS, item.condition)}
                  </td>
                  <td>
                    {new Intl.NumberFormat("hu-HU").format(item.price)} HUF
                  </td>
                  <td className='ta-right'>{item.count}</td>
                  <td
                    className='item__action'
                    onClick={() => handleRemoveItem(item)}>
                    <Trash className='svg-18' />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {error && <em className='fc-red-500 mt-0_5'>{error}</em>}
      </div>
    );
  },
});

export default ItemsList;
