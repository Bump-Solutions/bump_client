import { ReactNode } from "react";

type FieldGroupProps = {
  columns?: number;
  gap?: string;
  className?: string;
  children: ReactNode;
};

const FieldGroup = ({ columns, gap, className, children }: FieldGroupProps) => {
  return (
    <div
      className={`field__group columns-${columns} ${className ?? ""}`}
      style={{ gap }}>
      {children}
    </div>
  );
};

export default FieldGroup;
