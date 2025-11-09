import { useFieldContext } from "../../hooks/form/hooks";
import FormBase, { FormControlProps } from "./FormBase";

import TextArea from "../TextArea";

type FormTextAreaProps = FormControlProps & {
  rows?: number;
  maxLength?: number;
  autoAdjustHeight?: boolean;
  placeholder?: string;

  className?: string;
  autoFocus?: boolean;
  tabIndex?: number;
};

const FormTextArea = (props: FormTextAreaProps) => {
  const field = useFieldContext<string>();

  const success = Boolean(field.state.value) && field.state.meta.isValid;
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <FormBase {...props}>
      <TextArea
        name={field.name}
        required={props.required}
        placeholder={props.placeholder}
        value={field.state.value}
        onChange={field.handleChange}
        onBlur={field.handleBlur}
        rows={props.rows}
        maxLength={props.maxLength}
        autoAdjustHeight={props.autoAdjustHeight}
        success={success}
        isInvalid={isInvalid}
        autoFocus={props.autoFocus}
        tabIndex={props.tabIndex}
        className={props.className}
        aria-describedby={isInvalid ? `error-${field.name}` : undefined}
      />
    </FormBase>
  );
};

export default FormTextArea;
