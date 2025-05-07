import { ChangeEvent, InputHTMLAttributes } from "react";

import { useToggle } from "../hooks/useToggle";

import { formatPhoneNumber } from "../utils/functions";

import { Check } from "lucide-react";

interface PhoneProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label: string;
  required?: boolean;
  placeholder?: string;
  error?: string;
  success?: boolean;
  disabled?: boolean;
  value: string;
  name: string;
  onChange: (value: string) => void;
  className?: string;
  autoFocus?: boolean;
}

const Phone = ({
  label,
  required = false,
  placeholder,
  error,
  success,
  disabled = false,
  value,
  name,
  onChange,
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

  const inputClassName =
    (className ? className : "") +
    (error ? " error" : "") +
    (success ? " success" : "") +
    (disabled ? " disabled" : "");

  return (
    <div className='input'>
      <label
        htmlFor={name}
        className={`${isFocused ? "focused" : ""} ${
          value !== "" ? "filled" : ""
        } ${error ? "error" : ""}`}>
        {label}
        {required && <span className='required'> *</span>}
      </label>
      <div className='input__wrapper'>
        <input
          type='tel'
          value={value}
          onChange={handleOnChange}
          id={name}
          name={name}
          className={`input__field ${inputClassName}`}
          placeholder={placeholder || " "}
          autoFocus={autoFocus}
          disabled={disabled}
          onFocus={() => toggleFocus(true)}
          onBlur={() => toggleFocus(false)}
          {...props}
        />
        {success && <Check strokeWidth={3} className='input__svg success' />}
      </div>
      {error && <p className='error-msg'>{error}</p>}
    </div>
  );
};

export default Phone;
