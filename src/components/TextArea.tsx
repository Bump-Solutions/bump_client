import { TextareaHTMLAttributes, useState } from "react";

import { Check } from "lucide-react";

interface TextAreaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> {
  label: string;
  description?: string;
  error?: string;
  success?: boolean;
  disabled?: boolean;
  value: string;
  name: string;
  onChange: (value: string) => void;
  maxLength?: number;
}

const TextArea = ({
  label,
  description,
  placeholder,
  required = false,
  error,
  success,
  disabled,
  value,
  name,
  onChange,
  maxLength,
  className,
  autoFocus,
  rows,
  ...props
}: TextAreaProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleOnChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (maxLength && event.target.value.length > maxLength) return;
    onChange(event.target.value);
  };

  const textareaClassName = `${className} ${error ? "error" : ""} ${
    success ? "success" : ""
  } ${disabled ? "disabled" : ""}`;

  return (
    <div className='input'>
      <label
        className={`${isFocused ? "focused" : ""} ${
          value !== "" ? "filled" : ""
        } ${error ? "error" : ""}`}
        htmlFor={name}>
        {label}
        {required && <span className='required'> *</span>}
      </label>
      <div className='input__wrapper'>
        <textarea
          value={value}
          onChange={handleOnChange}
          id={name}
          name={name}
          placeholder={placeholder || " "}
          className={`input__field textarea ${textareaClassName}`}
          autoFocus={autoFocus}
          rows={rows}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          maxLength={maxLength}
          {...props}
          spellCheck={false}
        />

        {success && <Check strokeWidth={3} className='input__svg success' />}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
        {error && <p className='error-msg'>{error}</p>}
        {maxLength && (
          <p className='ta-right fc-light px-0' style={{ flex: 1 }}>
            {value.length} / {maxLength}
          </p>
        )}
      </div>
    </div>
  );
};

export default TextArea;
