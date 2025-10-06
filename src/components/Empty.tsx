import { JSX, ReactNode } from "react";

interface EmptyProps {
  icon?: JSX.Element;
  title: string;
  description?: string;
  children?: ReactNode;
}

const Empty = ({ icon, title, description, children }: EmptyProps) => {
  return (
    <div className='empty'>
      {icon && <div className='empty__media'>{icon}</div>}
      <div className='ta-center'>
        <h4>{title}</h4>
        {description && <p>{description}</p>}
      </div>

      {children && <div>{children}</div>}
    </div>
  );
};

export default Empty;
