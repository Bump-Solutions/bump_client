import "../../assets/css/error.css";
import { ROUTES } from "../../routes/routes";

import { useNavigate, Link, useLocation } from "react-router";
import { useTitle } from "react-use";

import Button from "../../components/Button";
import Reveal from "../../components/Reveal";

import { MoveLeft } from "lucide-react";

interface ErrorObject {
  code: number;
  title: string;
  message: string;
}

const ERRORS: ErrorObject[] = [
  {
    code: 404,
    title: "Hibás url cím",
    message: "Sajnáljuk, a keresett oldal nem található, vagy megszűnt.",
  },
  {
    code: 403,
    title: "Hiányzó jogosultság",
    message:
      "Sajnáljuk, de nincs jogosultságod a keresett oldal megtekintéséhez.",
  },
];

interface ErrorProps {
  code?: number;
}

const Error = ({ code }: ErrorProps) => {
  useTitle(`Valami hiba történt - Bump`);

  const navigate = useNavigate();
  const location = useLocation();

  const from =
    (location?.state as { from?: { pathname: string } })?.from?.pathname || "/";

  const error: ErrorObject = (location?.state as { error?: ErrorObject })
    ?.error ||
    ERRORS.find((error) => error.code === code) || {
      code: 500,
      title: "Valami hiba történt.",
      message:
        "Sajnáljuk, ismeretlen hibába ütköztünk a betöltés során. Kérjük próbáld meg frissíteni az oldalt.",
    };

  const handleOnClick = () => {
    navigate(from, { replace: true });
  };

  return (
    <section className='error__wrapper' data-error-code={error.code}>
      <Link to={ROUTES.HOME} className='fw-800'>
        bump.
      </Link>
      <article>
        <Reveal>
          <h1>{error.title}</h1>
        </Reveal>
        <Reveal delay={0.05}>
          <p>{error.message}</p>
        </Reveal>
        <Button
          className='primary'
          text='Térj vissza az oldalra'
          onClick={handleOnClick}>
          <MoveLeft />
        </Button>
      </article>
    </section>
  );
};

export default Error;
