import {
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  Placement,
  shift,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
} from "@floating-ui/react";
import { cloneElement, JSX, ReactNode, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TooltipProps {
  content: ReactNode;
  showDelay?: number;
  hideDelay?: number;
  placement?: Placement;
  children: JSX.Element;
}

const Tooltip = ({
  content,
  showDelay = 100,
  hideDelay = 100,
  placement = "top",
  children,
}: TooltipProps) => {
  const [open, setOpen] = useState(false);

  const {
    refs,
    context,
    x,
    y,
    strategy,
    placement: computedPlacement,
  } = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    middleware: [offset(8), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useHover(context, { delay: { open: showDelay, close: hideDelay } }),
    useFocus(context),
    useRole(context, { role: "tooltip" }),
    useDismiss(context),
  ]);

  const translate = {
    top: { translateY: 5 },
    bottom: { translateY: -5 },
    left: { translateX: 5 },
    right: { translateX: -5 },
  }[
    computedPlacement.includes("-")
      ? computedPlacement.split("-")[0]
      : computedPlacement
  ];

  return (
    <>
      {cloneElement(children, {
        ref: refs.setReference,
        ...getReferenceProps(),
      })}

      <FloatingPortal>
        <AnimatePresence>
          {open && (
            <motion.div
              {...getFloatingProps({
                ref: refs.setFloating,
                className: "tooltip",
                style: {
                  position: strategy,
                  top: y ?? 0,
                  left: x ?? 0,
                },
              })}
              className='tooltip'
              initial={{ opacity: 0, ...translate, scale: 0.95 }}
              animate={{ opacity: 1, translateX: 0, translateY: 0, scale: 1 }}
              exit={{ opacity: 0, ...translate, scale: 0.95 }}
              transition={{
                duration: 0.1,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}>
              {content}
            </motion.div>
          )}
        </AnimatePresence>
      </FloatingPortal>
    </>
  );
};

export default Tooltip;
