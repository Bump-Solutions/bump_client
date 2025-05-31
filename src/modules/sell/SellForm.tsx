import { useRef, MouseEvent } from "react";
import { useMultiStepForm } from "../../hooks/useMultiStepForm";
import { Link, useNavigate } from "react-router";
import { useSell } from "../../hooks/product/useSell";
import { useMounted } from "../../hooks/useMounted";
import { useUploadProduct } from "../../hooks/product/useUploadProduct";

import Button from "../../components/Button";
import SelectStep from "./steps/SelectStep";
import DetailsStep from "./steps/DetailsStep";
import ItemsStep from "./steps/ItemsStep";
import UploadStep from "./steps/UploadStep";
import StateButton from "../../components/StateButton";

import { ArrowUpRight, MoveRight, Tag } from "lucide-react";

const SellForm = () => {
  const navigate = useNavigate();
  const isMounted = useMounted();

  const selectRef = useRef<{ isValid: () => boolean }>(null);
  const detailsRef = useRef<{ isValid: () => boolean }>(null);
  const itemsref = useRef<{ isValid: () => boolean }>(null);
  const uploadsRef = useRef<{ isValid: () => boolean }>(null);

  const { data, clearErrors } = useSell();

  const { steps, currentStepIndex, isFirstStep, isLastStep, prev, next } =
    useMultiStepForm([
      {
        label: <>Már nem használod? Itt az ideje eladni! 💸</>,
        description: (
          <>
            Válassz{" "}
            <Link className='link no-anim gap-0' to='/' target='_blank'>
              katalógusból <ArrowUpRight className='svg-16 ml-0_25' />
            </Link>
            , vagy add meg a részleteket Te magad!
          </>
        ),
        ref: selectRef,
        component: <SelectStep ref={selectRef} />,
      },
      {
        label: (
          <>
            Add meg a termék részleteit! 📝
            <br />
            Minél több infót adsz meg, annál könnyebb az eladás.
          </>
        ),
        description: data.isCatalogProduct ? (
          <>
            Kérjük, tüntesd fel a termék méretét, állapotát és más fontos
            jellemzőit.
            <br />
            Ezek az információk segítenek a potenciális vásárlóknak megalapozott
            döntést hozni.
          </>
        ) : (
          <>
            Add meg a termék pontos adatait: márka, modell, szín és egyéb
            jellemzők.
            <br />
            Az ellenőrzés után lesz látható a hirdetésed.
          </>
        ),
        ref: detailsRef,
        component: <DetailsStep ref={detailsRef} />,
      },
      {
        label: <>Részletezd az eladó tételeket! 💰</>,
        description: (
          <>
            <b>Egy termékhez több tétel is tartozhat.</b>
            <br />
            Add meg a méretet, árat, állapotot és készletet minden eladásra
            szánt tételhez.
            <br />
            Segíts a vásárlóknak megtalálni a nekik megfelelő terméket!
          </>
        ),
        ref: itemsref,
        component: <ItemsStep ref={itemsref} />,
      },
      {
        label: <>Készíts képeket a cuccodról! 📸</>,
        description: (
          <>
            <span className='fc-red-500'>Kifejezetten fontos</span>, hogy a
            saját képeidet töltsd fel! Mások képeinek jogtalan felhasználása az
            oldalról való{" "}
            <Link className='link no-anim gap-0' to='/' target='_blank'>
              kitiltással <ArrowUpRight className='svg-16' />
            </Link>
            járhat.
            <br />
            Minimum 3, maximum 10 képet tölthetsz fel, amelyek egyenként
            legfeljebb 1MB méretűek lehetnek.
          </>
        ),
        ref: uploadsRef,
        component: <UploadStep ref={uploadsRef} />,
      },
    ]);

  const uploadProductMutation = useUploadProduct((resp, variables) => {
    setTimeout(() => {
      if (isMounted()) {
        navigate(-1);
      }
    }, 1000);
  });

  const handleFormSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const isValid = steps[currentStepIndex].ref?.current?.isValid();
    if (!isValid) {
      Promise.reject("Invalid fields");
      return;
    }

    // console.log("submit", data);

    return uploadProductMutation.mutateAsync(data);
  };

  return (
    <>
      <h1 className='modal__title mb-0_5 fs-22'>
        {steps[currentStepIndex].label}
      </h1>
      <p className='modal__description fc-light fs-16'>
        {steps[currentStepIndex].description}
      </p>

      <div className='modal__content'>
        <form className={`step-${currentStepIndex + 1}`}>
          {steps[currentStepIndex].component}
        </form>
      </div>

      <div className='modal__actions'>
        <span className='fs-16 fc-light truncate'>
          {currentStepIndex + 1} / {steps.length}
        </span>

        <div className='d-flex gap-2 a-center'>
          {!isFirstStep && (
            <Button
              type='button'
              text='Vissza'
              className='tertiary'
              onClick={() => {
                clearErrors();
                prev();
              }}
            />
          )}

          {isLastStep ? (
            <StateButton
              type='button'
              text='Eladás'
              className='primary mt-0 mb-0'
              onClick={(e) => handleFormSubmit(e)}>
              <Tag />
            </StateButton>
          ) : (
            <Button
              type='button'
              text='Folytatás'
              className={`tertiary icon--reverse `}
              onClick={(e) => next(e)}>
              <MoveRight />
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default SellForm;
