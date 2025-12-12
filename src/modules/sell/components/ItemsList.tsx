import { withForm } from "../../../hooks/form/hooks";
import { sellFormOptions } from "../../../utils/formOptions";

const ItemsList = withForm({
  ...sellFormOptions,
  render: function Render({ form }) {
    return <div className='item__column'>Items List Content</div>;
  },
});

export default ItemsList;
