import { useEffect, useRef } from "react";
import { Gradient } from "../../lib/gradient";

const StripeGradient = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gradientRef = useRef<Gradient | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gradient = new Gradient(canvas, { playing: true });
    gradientRef.current = gradient;

    return () => {
      // Cleanup if necessary
      gradientRef.current = null;
      gradient.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} id='stripe-canvas'></canvas>;
};

export default StripeGradient;
