type FieldErrorProps = {
  id: string;
  showAll?: boolean;
  errors: string[] | undefined;
};

const toMessages = (errors?: any[]): string[] => {
  if (!errors?.length) return [];

  return errors.flatMap((e) => {
    if (!e) return [];
    if (typeof e === "string") return [e];

    // ZodIssue shape: { message: string, code: string, ... }
    const maybeMsg = (e as any).message;
    if (typeof maybeMsg === "string" && maybeMsg.trim()) return [maybeMsg];

    // Esetleg más adapter: { error: string }
    const alt = (e as any).error;
    if (typeof alt === "string" && alt.trim()) return [alt];

    return [];
  });
};

const FieldError = ({ id, errors, showAll = false }: FieldErrorProps) => {
  const msgs = toMessages(errors);
  if (msgs.length === 0) return null;

  const list = showAll ? msgs : [msgs[0]];

  return (
    <em id={id} className='field__error' role='alert' aria-live='polite'>
      {list.join(" ")}
    </em>
  );
};

export default FieldError;
