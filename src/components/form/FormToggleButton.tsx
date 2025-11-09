import { useFieldContext } from "../../hooks/form/hooks";
import ToggleButton from "../ToggleButton";
import FormBase, { FormControlProps } from "./FormBase";

type FormToggleButtonProps = FormControlProps & {
  text?: string;
  placeholder?: string;
  color?: string;

  className?: string;
  autoFocus?: boolean;
  tabIndex?: number;
};

const FormToggleButton = (props: FormToggleButtonProps) => {
  const field = useFieldContext<boolean>();

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <FormBase {...props}>
      <ToggleButton
        name={field.name}
        label={props.text}
        value={field.state.value}
        onChange={field.handleChange}
        isInvalid={isInvalid}
        color={props.color}
        autoFocus={props.autoFocus}
        tabIndex={props.tabIndex}
        className={props.className}
        required={props.required}
      />
    </FormBase>
  );
};

export default FormToggleButton;
