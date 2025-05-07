import { MouseEvent } from "react";
import { Link, useNavigate } from "react-router";

import { MoveLeft } from "lucide-react";

interface BackProps {
  to?: string;
  onClick?: () => void;
  className?: string;
}

const Back = ({ to, onClick, className = "link" }: BackProps) => {
  const navigate = useNavigate();

  const handleClick = (e: MouseEvent) => {
    if (onClick) {
      onClick();
    } else if (!to) {
      e.preventDefault();
      navigate(-1);
    }
  };

  const content = (
    <>
      <MoveLeft /> <span>Vissza</span>
    </>
  );

  if (to) {
    return (
      <Link to={to} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <p
      onClick={handleClick}
      className={className}
      role='button'
      style={{ cursor: "pointer" }}>
      {content}
    </p>
  );
};

export default Back;
