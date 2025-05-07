import { motion, useAnimation, useInView } from "framer-motion";
import React, { useEffect, useRef, ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  width?: string;
}

const Reveal: React.FC<RevealProps> = ({
  children,
  delay,
  width = "fit-content",
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true });

  const mainControls = useAnimation();

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible");
    }
  }, [isInView, mainControls]);

  return (
    <div ref={ref} style={{ position: "relative", width, overflow: "hidden" }}>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 75 },
          visible: { opacity: 1, y: 0 },
        }}
        initial='hidden'
        animate={mainControls}
        transition={{
          duration: 0.2,
          delay: delay || 0,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}>
        {children}
      </motion.div>
    </div>
  );
};

export default Reveal;
