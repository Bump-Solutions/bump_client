import { useStore } from "@tanstack/react-form";
import { z } from "zod";
import { withForm } from "../../../hooks/form/hooks";
import { SELL_STEPS, sellSelectSchema } from "../../../schemas/sellSchema";
import { sellFormOptions } from "../../../utils/formOptions";

import Button from "../../../components/Button";

import { FileEdit, MoveRight, PackageSearch } from "lucide-react";

type SelectStepProps = {
  currentStepIndex: number;
  next: (schema: z.ZodType<any>) => void;
};

const SelectStep = withForm({
  ...sellFormOptions,
  props: {} as SelectStepProps,
  render: function Render({ form, currentStepIndex, next }) {
    // választott opció
    const isCatalog = useStore(
      form.store,
      (state) => state.values.select.isCatalog
    );

    const handleSelect = (value: boolean) => {
      if (value === isCatalog) {
        return;
      }

      // 1) beállítjuk az isCatalog-ot
      form.setFieldValue("select.isCatalog", value);

      // 2) a details.product-ot mindig “tiszta” állapotba hozzuk
      form.setFieldValue("details.product", {
        id: null,
        brand: "",
        model: "",
        colorWay: "",
      });
    };

    return (
      <>
        <div className='modal__content'>
          <div className='step step-1'>
            <div className='options__wrapper'>
              {/* Katalógus opció */}
              <article
                role='button'
                tabIndex={0}
                aria-pressed={isCatalog}
                className={`option ${isCatalog ? "selected" : ""}`}
                onClick={() => handleSelect(true)}
                onKeyDown={(e) =>
                  (e.key === "Enter" || e.key === " ") && handleSelect(true)
                }>
                <div className='option__col--radio'>
                  <div />
                </div>
                <div className='option__col--text'>
                  <h5 className='fw-700 fs-14'>AJÁNLOTT</h5>
                  <h3 className='fs-18 mt-0_25'>Katalógusból választok</h3>
                  <p className='fs-14 fc-gray-700 mt-0_75'>
                    Keresd meg a terméked márka, modell és színállás szerint, és
                    töltsd fel gyorsan és könnyedén.
                  </p>
                </div>
                <div className='option__col--img'>
                  <PackageSearch className='svg-64 fc-gray-600' />
                </div>
              </article>

              {/* Saját adatok opció */}
              <article
                role='button'
                tabIndex={0}
                aria-pressed={!isCatalog}
                className={`option ${!isCatalog ? "selected" : ""}`}
                onClick={() => handleSelect(false)}
                onKeyDown={(e) =>
                  (e.key === "Enter" || e.key === " ") && handleSelect(false)
                }>
                <div className='option__col--radio'>
                  <div />
                </div>
                <div className='option__col--text'>
                  <h3>Saját adatokat adok meg</h3>
                  <p className='fs-14 fc-gray-700 mt-0_5'>
                    Te adod meg a termék adatait, amit később ellenőrzünk.
                    <br />⏳ A termék az{" "}
                    <b className='fc-gray-900'>ellenőrzésig</b> nem jelenik meg
                    a profilon!
                  </p>
                </div>
                <div className='option__col--img'>
                  <FileEdit className='svg-64 fc-gray-600' />
                </div>
              </article>
            </div>
          </div>
        </div>

        <div className='modal__actions'>
          <span className='fs-16 fc-gray-600 truncate'>
            {currentStepIndex + 1} / {SELL_STEPS.length}
          </span>

          <div className='d-flex gap-2 a-center'>
            {/* Első lépés: nincs “Vissza” */}
            <Button
              type='button'
              text='Folytatás'
              className='tertiary icon--reverse'
              onClick={() => next(sellSelectSchema)}>
              <MoveRight />
            </Button>
          </div>
        </div>
      </>
    );
  },
});

export default SelectStep;
