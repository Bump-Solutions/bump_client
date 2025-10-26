import { useFieldContext } from "../../hooks/form/hooks";
import FormBase, { FormControlProps } from "./FormBase";

import Password from "../Password";

type FormPasswordProps = FormControlProps & {
  placeholder?: string;

  tabIndex?: number;
};

const FormPassword = (props: FormPasswordProps) => {
  const field = useFieldContext<string>();

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <FormBase {...props}>
      <Password
        name={field.name}
        required={props.required}
        placeholder={props.placeholder}
        value={field.state.value}
        onChange={field.handleChange}
        onBlur={field.handleBlur}
        isInvalid={isInvalid}
        tabIndex={props.tabIndex}
      />
    </FormBase>
  );
};

export default FormPassword;
