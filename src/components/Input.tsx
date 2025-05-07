import { ChangeEvent, InputHTMLAttributes } from "react";
import { useToggle } from "../hooks/useToggle";

import { Eye, EyeOff, Check } from "lucide-react";

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  type: string;
  label: string;
  required?: boolean;
  description?: string;
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

const Input = ({
  type,
  label,
  required = false,
  description,
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
}: InputProps) => {
  const [isFocused, toggleFocus] = useToggle(false);
  const [isPasswordVisible, togglePasswordVisibility] = useToggle(false);

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  const inputType = isPasswordVisible ? "text" : type;
  const inputClassName =
    (className ? className : "") +
    (error ? " error" : "") +
    (success ? " success" : "") +
    (disabled ? " disabled" : "");

  return (
    <div className='input'>
      {description && <p className='input__desc'>{description}</p>}
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
          type={inputType}
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
        {type === "password" &&
          (isPasswordVisible ? (
            <Eye
              onClick={() => togglePasswordVisibility(false)}
              className='input__svg'
            />
          ) : (
            <EyeOff
              onClick={() => togglePasswordVisibility(true)}
              className='input__svg'
            />
          ))}
        {success && <Check strokeWidth={3} className='input__svg success' />}
      </div>
      {error && <p className='error-msg'>{error}</p>}
    </div>
  );
};

export default Input;
