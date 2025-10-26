import { ReactNode } from "react";
import { useFieldContext } from "../../hooks/form/hooks";

import FieldLabel from "./FieldLabel";
import FieldDescription from "./FieldDescription";
import FieldError from "./FieldError";

export type FormControlProps = {
  label: string;
  description?: string;
  required?: boolean;
};

type FormBaseProps = FormControlProps & {
  children: ReactNode;
  horizontal?: boolean;
  controlFirst?: boolean;
};

const FormBase = ({
  children,
  label,
  description,
  required,
  horizontal,
  controlFirst,
}: FormBaseProps) => {
  const field = useFieldContext();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  const labelElement = (
    <>
      <FieldLabel htmlFor={field.name} required={required}>
        {label}
      </FieldLabel>
      {description && <FieldDescription>{description}</FieldDescription>}
    </>
  );

  const errorElement = isInvalid && (
    <FieldError id={`error-${field.name}`} errors={field.state.meta.errors} />
  );

  return (
    <div className='field'>
      {labelElement}
      {children}
      {errorElement}
    </div>
  );
};

export default FormBase;
