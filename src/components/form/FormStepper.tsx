import { useFieldContext } from "../../hooks/form/hooks";
import Stepper from "../Stepper";
import FormBase, { FormControlProps } from "./FormBase";

type FormStepperProps = FormControlProps & {
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;

  autoFocus?: boolean;
  tabIndex?: number;
};

const FormStepper = (props: FormStepperProps) => {
  const field = useFieldContext<number>();

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <FormBase {...props}>
      <Stepper
        name={field.name}
        value={field.state.value}
        required={props.required}
        placeholder={props.placeholder}
        onChange={field.handleChange}
        onBlur={field.handleBlur}
        min={props.min}
        max={props.max}
        step={props.step}
        aria-describedby={isInvalid ? `error-${field.name}` : undefined}
      />
    </FormBase>
  );
};

export default FormStepper;
