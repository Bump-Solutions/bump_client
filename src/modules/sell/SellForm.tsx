import { useStore } from "@tanstack/react-form";
import { JSX } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import { z } from "zod";
import { useAppForm } from "../../hooks/form/hooks";
import { SELL_FIELDS, SELL_STEPS, SellStep } from "../../schemas/sellSchema";
import {
  canGoNext,
  resetErroredFields,
  touchAndValidateFields,
} from "../../utils/form";
import { sellFormOptions } from "../../utils/formOptions";

import DetailsStep from "./steps/DetailsStep";
import SelectStep from "./steps/SelectStep";

import { ArrowUpRight } from "lucide-react";
import ItemsStep from "./steps/ItemsStep";

const LABELS: Record<SellStep, string | JSX.Element> = {
  select: "Már nem használod? Itt az ideje eladni! 💸",
  details: (
    <>
      Add meg a termék részleteit! 📝
      <br />
      Minél több infót adsz meg, annál könnyebb az eladás.
    </>
  ),
  items: "Részletezd az eladó tételeket! 💰",
  upload: "Készíts képeket a cuccodról! 📸",
};

const DESCRIPTIONS: Record<SellStep, JSX.Element> = {
  select: (
    <>
      Válassz{" "}
      <Link className='link no-anim gap-0' to='/' target='_blank'>
        katalógusból <ArrowUpRight className='svg-16 ml-0_25' />
      </Link>
      , vagy add meg a részleteket Te magad!
    </>
  ),
  details: (
    <>
      Kérjük, tüntesd fel a termék méretét, állapotát és más fontos jellemzőit.
      <br />
      Ezek az információk segítenek a potenciális vásárlóknak megalapozott
      döntést hozni.
    </>
  ),
  items: (
    <>
      <b>Egy termékhez több tétel is tartozhat.</b>
      <br />
      Add meg a méretet, árat, állapotot és készletet minden eladásra szánt
      tételhez.
      <br />
      Segíts a vásárlóknak megtalálni a nekik megfelelő terméket!
    </>
  ),
  upload: (
    <>
      <span className='fc-red-500'>Kifejezetten fontos</span>, hogy a saját
      képeidet töltsd fel! Mások képeinek jogtalan felhasználása az oldalról
      való{" "}
      <Link className='link no-anim gap-0' to='/' target='_blank'>
        kitiltással <ArrowUpRight className='svg-16' />
      </Link>
      járhat.
      <br />
      Minimum 3, maximum 10 képet tölthetsz fel, amelyek egyenként legfeljebb
      1MB méretűek lehetnek.
    </>
  ),
};

const SellForm = () => {
  const form = useAppForm({
    ...sellFormOptions,
    onSubmit: async ({ value, formApi }) => {},

    onSubmitInvalid: async ({ value, formApi }) => {
      throw new Error("Invalid form submission");
    },
  });

  const isBusy = useStore(
    form.store,
    (state) =>
      state.isValidating || state.isFormValidating || state.isFieldsValidating
  );

  const step = useStore(form.store, (state) => state.values.step as SellStep);
  const currentIndex = SELL_STEPS.indexOf(step);
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === SELL_STEPS.length - 1;

  const setStep = (next: SellStep) => form.setFieldValue("step", next);

  const next = async (schema: z.ZodType<any>) => {
    if (isLast) return;
    if (isBusy) return;

    const { isValid } = await canGoNext(form, schema);
    if (isValid) {
      setStep(SELL_STEPS[currentIndex + 1]);
      return;
    }

    const fields = SELL_FIELDS[step];
    await touchAndValidateFields(form, fields);

    toast.error("Kérjük javítsd a hibás mezőket!");
  };

  const prev = () => {
    if (isFirst) return;

    const fields = SELL_FIELDS[step];
    resetErroredFields(form, fields);

    setStep(SELL_STEPS[currentIndex - 1]);
  };

  return (
    <>
      <h1 className='modal__title mb-0_5 fs-22'>{LABELS[step]}</h1>
      <p className='modal__description fc-gray-600 fs-16'>
        {DESCRIPTIONS[step]}
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}>
        {step === "select" && (
          <SelectStep form={form} currentStepIndex={currentIndex} next={next} />
        )}
        {step === "details" && (
          <DetailsStep
            form={form}
            currentStepIndex={currentIndex}
            next={next}
            prev={prev}
          />
        )}
        {step === "items" && (
          <ItemsStep
            form={form}
            currentStepIndex={currentIndex}
            next={next}
            prev={prev}
          />
        )}
      </form>
    </>
  );
};

export default SellForm;
