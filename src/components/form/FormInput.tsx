import { useFieldContext } from "../../hooks/form/hooks";
import FormBase, { FormControlProps } from "./FormBase";

import Input from "../Input";

type FormInputProps = FormControlProps & {
  type: "text" | "email";
  placeholder?: string;

  autoFocus?: boolean;
  tabIndex?: number;
};

const FormInput = (props: FormInputProps) => {
  const field = useFieldContext<string>();

  const success = Boolean(field.state.value) && field.state.meta.isValid;
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <FormBase {...props}>
      <Input
        type={props.type}
        name={field.name}
        required={props.required}
        placeholder={props.placeholder}
        value={field.state.value}
        onChange={field.handleChange}
        onBlur={field.handleBlur}
        success={success}
        isInvalid={isInvalid}
        autoFocus={props.autoFocus}
        tabIndex={props.tabIndex}
        aria-describedby={isInvalid ? `error-${field.name}` : undefined}
      />
    </FormBase>
  );
};

export default FormInput;
