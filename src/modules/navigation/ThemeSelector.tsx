import { useState } from "react";
import { Sun, Moon, Contrast } from "lucide-react";
import {
  useFloating,
  flip,
  shift,
  offset,
  autoUpdate,
  FloatingPortal,
  useRole,
  useDismiss,
  useInteractions,
} from "@floating-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "../../hooks/useTheme";

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState<React.ReactNode>(null);

  const { refs, context, x, y, strategy, placement } = useFloating({
    placement: "top",
    open,
    onOpenChange: setOpen,
    middleware: [offset(8), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  });

  const { getFloatingProps } = useInteractions([
    useRole(context, { role: "tooltip" }),
    useDismiss(context),
  ]);

  const bind = (label: string) => ({
    onMouseEnter: (e: React.MouseEvent<HTMLButtonElement>) => {
      refs.setReference(e.currentTarget);
      setContent(label);
      setOpen(true);
    },
    onFocus: (e: React.FocusEvent<HTMLButtonElement>) => {
      refs.setReference(e.currentTarget);
      setContent(label);
      setOpen(true);
    },
    onMouseLeave: () => setOpen(false),
    onBlur: () => setOpen(false),
  });

  const translate =
    (placement.includes("-") ? placement.split("-")[0] : placement) === "top"
      ? { translateY: 5 }
      : (placement.includes("-") ? placement.split("-")[0] : placement) ===
        "bottom"
      ? { translateY: -5 }
      : (placement.includes("-") ? placement.split("-")[0] : placement) ===
        "left"
      ? { translateX: 5 }
      : { translateX: -5 };

  return (
    <div>
      <span>
        <button
          type='button'
          {...bind("Világos")}
          onClick={() => setTheme("light")}
          className={theme === "light" ? "active" : ""}
          aria-label='Világos'>
          <Sun />
        </button>
      </span>

      <span>
        <button
          type='button'
          {...bind("Sötét")}
          onClick={() => setTheme("dark")}
          className={theme === "dark" ? "active" : ""}
          aria-label='Sötét'>
          <Moon />
        </button>
      </span>

      <span>
        <button
          type='button'
          {...bind("Rendszer")}
          onClick={() => setTheme("system")}
          className={theme === "system" ? "active" : ""}
          aria-label='Rendszer'>
          <Contrast />
        </button>
      </span>

      {/* Egyetlen közös tooltip */}
      <FloatingPortal>
        <AnimatePresence>
          {open && (
            <motion.div
              {...getFloatingProps({
                ref: refs.setFloating,
                className: "tooltip",
                style: { position: strategy, top: y ?? 0, left: x ?? 0 },
              })}
              initial={{ opacity: 0, scale: 0.95, ...translate }}
              animate={{ opacity: 1, scale: 1, translateX: 0, translateY: 0 }}
              exit={{ opacity: 0, scale: 0.95, ...translate }}
              transition={{ duration: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}>
              {content}
            </motion.div>
          )}
        </AnimatePresence>
      </FloatingPortal>
    </div>
  );
}
