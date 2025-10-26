type FieldDescriptionProps = {
  children: string;
};

const FieldDescription = ({ children }: FieldDescriptionProps) => {
  return <p className='field__description'>{children}</p>;
};

export default FieldDescription;
