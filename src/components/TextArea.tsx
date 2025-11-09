import {
  ChangeEvent,
  TextareaHTMLAttributes,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { Check } from "lucide-react";

interface TextAreaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> {
  name: string;
  value: string;

  required?: boolean;
  placeholder?: string;

  success?: boolean;
  isInvalid?: boolean;
  disabled?: boolean;

  description?: string;

  onChange: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;

  rows?: number;
  maxLength?: number;
  autoAdjustHeight?: boolean;

  className?: string;
  autoFocus?: boolean;
}

const TextArea = ({
  name,
  value,

  required = false,
  placeholder = " ",

  success = false,
  isInvalid = false,
  disabled = false,

  description = "",

  onChange,
  onBlur,
  onFocus,

  rows,
  maxLength,
  autoAdjustHeight = false,

  className,
  autoFocus,
  ...props
}: TextAreaProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const adjustHeight = useCallback(() => {
    if (!autoAdjustHeight) return;
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${ta.scrollHeight}px`;
  }, [autoAdjustHeight]);

  useLayoutEffect(() => {
    adjustHeight();
  }, [value, adjustHeight]);

  const handleOnChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (maxLength && event.target.value.length > maxLength) return;
    onChange(event.target.value);
  };

  const handleOnBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const handleOnFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const textareaClassName =
    (className ? className : "") +
    (isFocused ? " focused" : "") +
    (isInvalid ? " error" : "") +
    (success ? " success" : "") +
    (disabled ? " disabled" : "");

  return (
    <>
      <div className='field__input'>
        <textarea
          ref={textareaRef}
          id={name}
          name={name}
          value={value}
          onChange={handleOnChange}
          onFocus={handleOnFocus}
          onBlur={handleOnBlur}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          rows={rows}
          maxLength={maxLength}
          className={textareaClassName}
          autoFocus={autoFocus}
          spellCheck={false}
          {...props}
        />

        {success && (
          <Check strokeWidth={3} className='input__svg top success' />
        )}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
        {maxLength && (
          <p
            className='ta-right fc-gray-600 px-0'
            style={{ flex: 1, lineHeight: 1.6 }}>
            {value.length} / {maxLength}
          </p>
        )}
      </div>
    </>
  );
};

export default TextArea;
