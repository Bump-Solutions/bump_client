import { forwardRef, useImperativeHandle } from "react";
import { useSell } from "../../../hooks/product/useSell";
import { useToast } from "../../../hooks/useToast";
import { useDebounce } from "../../../hooks/useDebounce";

import Input from "../../../components/Input";
import TextArea from "../../../components/TextArea";

import BrandChips from "./BrandChips";
import ModelChips from "./ModelChips";
import ColorwayChips from "./ColorwayChips";

interface DetailsStepRef {
  isValid: () => boolean;
}

const DetailsStep = forwardRef<DetailsStepRef>(({}, ref) => {
  const { addToast } = useToast();

  const { data, updateData, errors, setErrors } = useSell();

  useImperativeHandle(ref, () => ({ isValid }));

  const isValid = () => {
    const inputFields = {
      title: data.title,
      brand: data.product?.brand,
      model: data.product?.model,
      colorway: data.product?.color_way,
    };

    const emptyInputs = Object.keys(inputFields).filter(
      (key) => !inputFields[key as keyof typeof inputFields]
    );

    if (emptyInputs.length > 0) {
      emptyInputs.forEach((key) => {
        setErrors((prev) => ({
          ...prev,
          [key]: "A mező kitöltése kötelező.",
        }));
      });

      addToast("error", "Kérjük töltsd ki a csillaggal jelölt mezőket!");
      return false;
    }

    if (Object.values(errors).some((x) => x !== "")) {
      addToast("error", "Kérjük javítsd a hibás mezőket!");
      return false;
    }

    return true;
  };

  useDebounce(
    () => {
      setErrors((prevErrors) => ({
        ...prevErrors,
        title: "",
      }));
    },
    0,
    [data.title]
  );

  useDebounce(
    () => {
      setErrors((prevErrors) => ({
        ...prevErrors,
        brand: "",
      }));
    },
    0,
    [data.product?.brand]
  );

  useDebounce(
    () => {
      setErrors((prevErrors) => ({
        ...prevErrors,
        model: "",
      }));
    },
    0,
    [data.product?.model]
  );

  useDebounce(
    () => {
      setErrors((prevErrors) => ({
        ...prevErrors,
        colorway: "",
      }));
    },
    0,
    [data.product?.color_way]
  );

  return (
    <div
      className={`details__wrapper ${
        data.isCatalogProduct ? "catalog" : "custom"
      }`}>
      <Input
        type='text'
        name='pr_title'
        value={data.title}
        placeholder='pl. Nike Air Force 1 Triple White'
        label='Cím'
        required
        onChange={(value) => {
          updateData({ title: value });
        }}
        error={errors.title}
        success={!!data.title && !errors.title}
        autoFocus
      />
      <TextArea
        name='pr_description'
        value={data.description}
        label='Leírás'
        placeholder='pl. Eladó Nike Force 1, 42-es méretben, jó állapotban.'
        onChange={(value) => {
          updateData({ description: value });
        }}
        maxLength={500}
        rows={4}
      />

      {data.isCatalogProduct ? (
        <>
          <BrandChips />
          <ModelChips />
          <ColorwayChips />
        </>
      ) : (
        <>
          <Input
            type='text'
            name='pr_brand'
            value={data.product?.brand || ""}
            placeholder='pl. Nike'
            label='Márka'
            required
            onChange={(value) =>
              updateData({ product: { ...data.product, brand: value } })
            }
            error={errors.brand}
            success={!!data.product?.brand && !errors.brand}
          />
          <Input
            type='text'
            name='pr_model'
            value={data.product?.model || ""}
            placeholder='pl. Air Force 1'
            label='Modell'
            required
            onChange={(value) =>
              updateData({ product: { ...data.product, model: value } })
            }
            error={errors.model}
            success={!!data.product?.model && !errors.model}
          />
          <Input
            type='text'
            name='pr_colorway'
            value={data.product?.color_way || ""}
            placeholder='pl. Triple White'
            label='Színállás'
            required
            onChange={(value) =>
              updateData({ product: { ...data.product, color_way: value } })
            }
            error={errors.color_way}
            success={!!data.product?.color_way && !errors.color_way}
          />
        </>
      )}
    </div>
  );
});

export default DetailsStep;
