import { Eye, EyeOff } from "lucide-react";
import { ChangeEvent, InputHTMLAttributes, Ref, useId } from "react";
import { useToggle } from "react-use";

interface PasswordProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "type"> {
  ref?: Ref<HTMLInputElement>;
  name: string;
  value: string;

  required?: boolean;
  placeholder?: string;

  isInvalid?: boolean;
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
  value,

  required = false,
  placeholder = " ",

  isInvalid = false,
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

  const handleOnFocus = () => {
    toggleFocus(true);
    if (onFocus) onFocus();
  };

  const inputClassName =
    (className ? className : "") +
    (isFocused ? " focused" : "") +
    (isInvalid ? " error" : "") +
    (disabled ? " disabled" : "");

  const inputType = isVisible ? "text" : "password";
  const inputId = name || uid;

  return (
    <div className='field__input'>
      <input
        ref={ref}
        type={inputType}
        id={inputId}
        name={name}
        value={value}
        onChange={handleOnChange}
        onBlur={handleOnBlur}
        onFocus={handleOnFocus}
        className={inputClassName}
        placeholder={placeholder}
        autoFocus={autoFocus}
        disabled={disabled}
        {...props}
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
    </div>
  );
};

export default Password;
