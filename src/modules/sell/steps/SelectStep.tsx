import { forwardRef, useImperativeHandle } from "react";

import { PackageSearch, FileEdit } from "lucide-react";
import { useSell } from "../../../hooks/product/useSell";

interface SelectStepRef {
  isValid: () => boolean;
}

const SelectStep = forwardRef<SelectStepRef>(({}, ref) => {
  const { data, updateData } = useSell();

  useImperativeHandle(ref, () => ({ isValid }));

  const isValid = () => {
    return true;
  };

  const handleSelect = (value: boolean) => {
    if (data.product.isCatalog === value) {
      return;
    } else {
      // Ha változik a kiválasztott érték, akkor frissítjük a product state-et is

      updateData({
        product: {
          isCatalog: value,
          id: null,
          brand: "",
          model: "",
          colorWay: "",
        },
      });
    }
  };

  return (
    <div className='options__wrapper'>
      <article
        className={`option ${data.product.isCatalog ? "selected" : ""}`}
        onClick={() => handleSelect(true)}>
        <div className='option__col--radio'>
          <div />
        </div>
        <div className='option__col--text'>
          <h5 className='fw-700 fs-14'>AJÁNLOTT</h5>
          <h3 className='fs-18 mt-0_25'>Katalógusból választok</h3>
          <p className='fs-14 fc-medium mt-0_75'>
            Keresd meg a terméked márka, modell és színállás szerint, és töltsd
            fel gyorsan és könnyedén.
          </p>
        </div>
        <div className='option__col--img'>
          <PackageSearch className='svg-64 fc-light' />
        </div>
      </article>

      <article
        className={`option ${data.product.isCatalog ? "" : "selected"}`}
        onClick={() => handleSelect(false)}>
        <div className='option__col--radio'>
          <div />
        </div>
        <div className='option__col--text'>
          <h3>Saját adatokat adok meg</h3>
          <p className='fs-14 fc-medium mt-0_5'>
            Te adod meg a termék adatait, amit később ellenőrzünk.
            <br />⏳ A termék az <b>ellenőrzésig</b> nem jelenik meg a profilon!
          </p>
        </div>
        <div className='option__col--img'>
          <FileEdit className='svg-64 fc-light' />
        </div>
      </article>
    </div>
  );
});

export default SelectStep;
