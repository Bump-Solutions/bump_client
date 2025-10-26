import { createFormHook, createFormHookContexts } from "@tanstack/react-form";

import FormInput from "../../components/form/FormInput";
import FormPassword from "../../components/form/FormPassword";
import FormPhone from "../../components/form/FormPhone";
import FormSelect from "../../components/form/FormSelect";

const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    Input: FormInput,
    Password: FormPassword,
    Phone: FormPhone,
    Select: FormSelect,
  },
  formComponents: {},
});

export { useAppForm, withForm, useFieldContext, useFormContext };
