import { Check, Eye, EyeOff } from "lucide-react";
import { ChangeEvent, InputHTMLAttributes, Ref, useId } from "react";
import { useToggle } from "react-use";

interface PasswordProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "type"> {
  ref?: Ref<HTMLInputElement>;
  name: string;
  label: string;
  value: string;

  required?: boolean;
  placeholder?: string;
  description?: string;

  error?: string;
  success?: boolean;
  disabled?: boolean;

  onChange: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;

  className?: string;
  autoFocus?: boolean;

  showToggle?: boolean;
}

const Password = ({
  ref,
  name,
  label,
  value,

  required = false,
  placeholder = " ",
  description,

  error,
  success,
  disabled = false,

  onChange,
  onBlur,
  onFocus,

  className = "",
  autoFocus = false,
  showToggle = true,
  ...props
}: PasswordProps) => {
  const [isFocused, toggleFocus] = useToggle(false);
  const [isVisible, toggleVisible] = useToggle(false);
  const uid = useId();

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    onChange(event.target.value);
  };

  const handleOnBlur = () => {
    toggleFocus(false);
    if (onBlur) onBlur();
  };

  const labelClassName = `${isFocused ? "focused" : ""} ${
    value !== "" ? "filled" : ""
  } ${error ? "error" : ""}`;

  const inputClassName =
    (className ? className : "") +
    (error ? " error" : "") +
    (success ? " success" : "") +
    (disabled ? " disabled" : "");

  const inputType = isVisible ? "text" : "password";
  const inputId = name || uid;

  return (
    <div className='input'>
      {description && <p className='input__desc'>{description}</p>}

      <label htmlFor={inputId} className={labelClassName}>
        {label}
        {required && <span className='required'> *</span>}
      </label>

      <div className='input__wrapper'>
        <input
          ref={ref}
          type={inputType}
          id={inputId}
          name={name}
          value={value}
          onChange={handleOnChange}
          onBlur={handleOnBlur}
          onFocus={onFocus}
          className={`input__field ${inputClassName}`}
          placeholder={placeholder}
          autoFocus={autoFocus}
          disabled={disabled}
        />

        {showToggle &&
          (isVisible ? (
            <button
              type='button'
              className='input__svg' // ha buttonra külön stílus kell: addj .input__iconbtn-t
              onClick={() => toggleVisible(false)}
              aria-label='Jelszó elrejtése'
              aria-pressed='true'
              tabIndex={-1}>
              <Eye />
            </button>
          ) : (
            <button
              type='button'
              className='input__svg'
              onClick={() => toggleVisible(true)}
              aria-label='Jelszó megjelenítése'
              aria-pressed='false'
              tabIndex={-1}>
              <EyeOff />
            </button>
          ))}

        {success && <Check strokeWidth={3} className='input__svg success' />}
      </div>

      {error && (
        <em id={`${inputId}-error`} className='error-msg'>
          {error}
        </em>
      )}
    </div>
  );
};

export default Password;
