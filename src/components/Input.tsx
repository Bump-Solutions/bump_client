import { ChangeEvent, InputHTMLAttributes, Ref } from "react";
import { useToggle } from "../hooks/useToggle";

import { Check } from "lucide-react";

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  ref?: Ref<HTMLInputElement>;
  type?: string;
  name: string;
  value: string;

  required?: boolean;
  placeholder?: string;

  success?: boolean;
  isInvalid?: boolean;
  disabled?: boolean;

  onChange: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;

  className?: string;
  autoFocus?: boolean;
}

const Input = ({
  ref,
  type = "text",
  name,
  value,

  required = false,
  placeholder = " ",

  success = false,
  isInvalid = false,
  disabled = false,

  onChange,
  onBlur,
  onFocus,

  className = "",
  autoFocus = false,
  ...props
}: InputProps) => {
  const [isFocused, toggleFocus] = useToggle(false);

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    onChange(event.target.value);
  };

  const handleOnBlur = () => {
    toggleFocus(false);
    onBlur?.();
  };

  const handleOnFocus = () => {
    toggleFocus(true);
    onFocus?.();
  };

  const inputClassName =
    (className ? className : "") +
    (isFocused ? " focused" : "") +
    (isInvalid ? " error" : "") +
    (success ? " success" : "") +
    (disabled ? " disabled" : "");

  return (
    <div className='field__input'>
      <input
        ref={ref}
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={handleOnChange}
        onBlur={handleOnBlur}
        onFocus={handleOnFocus}
        className={inputClassName}
        placeholder={placeholder}
        autoFocus={autoFocus}
        required={required}
        disabled={disabled}
        data-invalid={isInvalid}
        aria-invalid={isInvalid}
        {...props}
      />
      {success && <Check strokeWidth={3} className='input__svg success' />}
    </div>
  );
};

export default Input;
