import { FC, SVGProps, ReactNode, MouseEvent, useState } from "react";
import { AnimatePresence, motion, HTMLMotionProps } from "framer-motion";

import { Loader, Check, X } from "lucide-react";

interface IconOverlayProps {
  Icon: FC<SVGProps<SVGSVGElement>>;
  visible: boolean;
  spin?: boolean;
}

const IconOverlay = ({ Icon, visible, spin }: IconOverlayProps) => {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{
            y: -12,
            opacity: 0,
          }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          transition={{ duration: 0.25, ease: [0.5, 0.46, 0.45, 0.94] }}
          exit={{
            y: 12,
            opacity: 0,
          }}
          className='icon-overlay'>
          <Icon className={`icon svg-18 ${spin ? "spin" : ""}`} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

type ButtonState = "neutral" | "loading" | "success" | "error";

interface StateButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  children?: ReactNode;
  className?: string;
  text?: string;
  onClick: (event: MouseEvent<HTMLButtonElement>) => Promise<any>;
}

const StateButton = ({
  children,
  className,
  text,
  onClick,
  ...props
}: StateButtonProps) => {
  const [state, setState] = useState<ButtonState>("neutral");

  const classNames =
    state === "neutral"
      ? "neutral"
      : state === "error"
      ? "error"
      : state === "success"
      ? "success"
      : "loading";

  const handleClick = async (event: MouseEvent<HTMLButtonElement>) => {
    if (state !== "neutral") return;

    setState("loading");

    try {
      await onClick(event);
      setState("success");
    } catch (error) {
      setState("error");
    } finally {
      setTimeout(() => {
        setState("neutral");
      }, 1500);
    }
  };

  return (
    <motion.button
      type='button'
      onClick={handleClick}
      className={`button ${className} ${classNames}`}
      {...props}>
      <motion.span
        animate={{
          y: state === "neutral" ? 0 : 6,
          opacity: state === "neutral" ? 1 : 0,
        }}>
        {children}
        {text ? text : null}
      </motion.span>
      <IconOverlay Icon={Loader} visible={state === "loading"} spin />
      <IconOverlay Icon={X} visible={state === "error"} />
      <IconOverlay Icon={Check} visible={state === "success"} />
    </motion.button>
  );
};

export default StateButton;
