import { ReactNode, ButtonHTMLAttributes } from "react";

import Spinner from "./Spinner";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  className?: string;
  loading?: boolean;
  disabled?: boolean;
  text?: string;
}

const Button = ({
  children,
  className,
  loading,
  disabled,
  text,
  ...props
}: ButtonProps) => {
  const classN = className ? `button ${className}` : "button";

  return (
    <button
      type='button'
      className={classN}
      disabled={disabled || loading}
      {...props}>
      {loading ? (
        <Spinner size={18} />
      ) : (
        <>
          {children}
          {text && <span>{text}</span>}
        </>
      )}
    </button>
  );
};

export default Button;
