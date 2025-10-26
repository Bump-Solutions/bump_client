import { ChangeEvent, InputHTMLAttributes } from "react";

import { useToggle } from "../hooks/useToggle";

import { formatPhoneNumber } from "../utils/functions";

import { Check } from "lucide-react";

interface PhoneProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
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

const Phone = ({
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
}: PhoneProps) => {
  const [isFocused, toggleFocus] = useToggle(false);

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value: inputValue } = event.target;

    if (inputValue === "") {
      onChange(inputValue);
      return;
    }

    const formattedValue = formatPhoneNumber(inputValue);
    onChange(formattedValue);
  };

  const handleOnBlur = () => {
    toggleFocus(false);
    if (onBlur) onBlur();
  };

  const handleOnFocus = () => {
    toggleFocus(true);
    if (onFocus) onFocus();
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
        type='tel'
        id={name}
        name={name}
        value={value}
        onChange={handleOnChange}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
        className={inputClassName}
        placeholder={placeholder}
        autoFocus={autoFocus}
        disabled={disabled}
        {...props}
      />
      {success && <Check strokeWidth={3} className='input__svg success' />}
    </div>
  );
};

export default Phone;
