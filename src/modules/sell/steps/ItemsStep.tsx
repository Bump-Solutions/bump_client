import { z } from "zod";
import { withForm } from "../../../hooks/form/hooks";
import { SELL_STEPS, sellItemsSchema } from "../../../schemas/sellSchema";
import { sellFormOptions } from "../../../utils/formOptions";

import Button from "../../../components/Button";

import { MoveRight } from "lucide-react";
import ItemForm from "../components/ItemForm";
import ItemsList from "../components/ItemsList";

type ItemsStepProps = {
  currentStepIndex: number;
  next: (schema: z.ZodType<any>) => void;
  prev: () => void;
};

const ItemsStep = withForm({
  ...sellFormOptions,
  props: {} as ItemsStepProps,
  render: function Render({ form, currentStepIndex, next, prev }) {
    return (
      <>
        <div className='modal__content'>
          <div className='step step-3'>
            <div className='items__wrapper'>
              <ItemForm form={form} />
              <div className='divider' />
              <ItemsList form={form} />
            </div>
          </div>
        </div>

        <div className='modal__actions'>
          <span className='fs-16 fc-gray-600 truncate'>
            {currentStepIndex + 1} / {SELL_STEPS.length}
          </span>

          <div className='d-flex gap-2 a-center'>
            <Button
              type='button'
              text='Vissza'
              className='tertiary'
              onClick={prev}
            />

            <Button
              type='button'
              text='Folytatás'
              className={`tertiary icon--reverse `}
              onClick={() => next(sellItemsSchema)}>
              <MoveRight />
            </Button>
          </div>
        </div>
      </>
    );
  },
});

export default ItemsStep;
