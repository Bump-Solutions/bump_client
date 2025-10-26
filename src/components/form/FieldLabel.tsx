type FieldLabelProps = {
  htmlFor: string;
  required?: boolean;
  children: string;
};

const FieldLabel = ({ htmlFor, required, children }: FieldLabelProps) => {
  return (
    <label htmlFor={htmlFor} className='field__label'>
      {children}
      {required && <span className='required'> *</span>}
    </label>
  );
};

export default FieldLabel;
