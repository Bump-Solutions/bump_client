import { useSell } from "../../../hooks/product/useSell";

import { Trash } from "lucide-react";
import { useDebounce } from "../../../hooks/useDebounce";

const ItemsList = () => {
  const { data, updateData, errors, setErrors } = useSell();

  const groupedItems = data.items.reduce((acc, item) => {
    const key = `${item.gender.label}-${item.size.label}-${item.condition.label}-${item.price}`;

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
  }, {} as Record<string, any>);

  const handleRemoveItem = (item: any) => {
    updateData({
      items: data.items.filter((i) => {
        const key = `${i.gender.label}-${i.size.label}-${i.condition.label}-${i.price}`;
        return key !== item.key;
      }),
    });
  };

  useDebounce(
    () => {
      setErrors((prevErrors) => ({
        ...prevErrors,
        items: "",
      }));
    },
    0,
    [data.items]
  );

  return (
    <div className='item__column'>
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
            Object.values(groupedItems).map((item, index) => (
              <tr key={index}>
                <td>{item.gender.label}</td>
                <td>{item.size.label}</td>
                <td>{item.condition.label}</td>
                <td>{new Intl.NumberFormat("hu-HU").format(item.price)} HUF</td>
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
      {errors.items && <p className='fc-red-500 mt-0_5'>{errors.items}</p>}
    </div>
  );
};

export default ItemsList;
