import { createFormHook, createFormHookContexts } from "@tanstack/react-form";

import FormCurrency from "../../components/form/FormCurrency";
import FormDropzone from "../../components/form/FormDropzone";
import FormInput from "../../components/form/FormInput";
import FormPassword from "../../components/form/FormPassword";
import FormPhone from "../../components/form/FormPhone";
import FormSelect from "../../components/form/FormSelect";
import FormStepper from "../../components/form/FormStepper";
import FormTextArea from "../../components/form/FormTextArea";
import FormToggleButton from "../../components/form/FormToggleButton";

export type AppFormApi = ReturnType<typeof useAppForm>;

const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    Input: FormInput,
    Dropzone: FormDropzone,
    Password: FormPassword,
    Phone: FormPhone,
    Select: FormSelect,
    Stepper: FormStepper,
    TextArea: FormTextArea,
    ToggleButton: FormToggleButton,
    Currency: FormCurrency,
  },
  formComponents: {},
});

export { useAppForm, useFieldContext, useFormContext, withForm };
