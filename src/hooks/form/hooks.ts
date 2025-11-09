import { createFormHook, createFormHookContexts } from "@tanstack/react-form";

import FormInput from "../../components/form/FormInput";
import FormPassword from "../../components/form/FormPassword";
import FormPhone from "../../components/form/FormPhone";
import FormSelect from "../../components/form/FormSelect";
import FormTextArea from "../../components/form/FormTextArea";
import FormToggleButton from "../../components/form/FormToggleButton";
import FormDropzone from "../../components/form/FormDropzone";

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
    TextArea: FormTextArea,
    ToggleButton: FormToggleButton,
  },
  formComponents: {},
});

export { useAppForm, withForm, useFieldContext, useFormContext };
