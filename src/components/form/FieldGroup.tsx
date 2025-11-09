import { ReactNode } from "react";

type FieldGroupProps = {
  columns?: number;
  gap?: string;
  children: ReactNode;
};

const FieldGroup = ({ columns, gap, children }: FieldGroupProps) => {
  return (
    <div className={`field__group columns-${columns}`} style={{ gap }}>
      {children}
    </div>
  );
};

export default FieldGroup;
