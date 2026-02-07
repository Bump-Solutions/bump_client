import { useCallback, useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { Gradient } from "../../lib/gradient";

const StripeGradient = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gradientRef = useRef<Gradient | null>(null);

  const { ref: inViewRef, inView } = useInView({
    threshold: 0.01,
  });

  const setRefs = useCallback(
    (node: HTMLCanvasElement | null) => {
      canvasRef.current = node;
      inViewRef(node);
    },
    [inViewRef],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gradient = new Gradient(canvas, { playing: false });
    gradientRef.current = gradient;

    return () => {
      // Cleanup if necessary
      gradientRef.current = null;
      gradient.disconnect();
    };
  }, []);

  // Ha változik a láthatóság, play/pause
  useEffect(() => {
    const gradient = gradientRef.current;
    if (!gradient) return;

    if (inView) {
      // 1) Ha van publikus play(), használd azt
      if (typeof gradient.play === "function") {
        gradient.play();
      } else {
        // 2) Ellenkező esetben állítsd a belső "conf.playing" flaget
        if (gradient.conf) gradient.conf.playing = true;
      }
    } else {
      if (typeof gradient.pause === "function") {
        gradient.pause();
      } else {
        if (gradient.conf) gradient.conf.playing = false;
      }
    }
  }, [inView]);

  return <canvas ref={setRefs} id='stripe-canvas'></canvas>;
};

export default StripeGradient;
