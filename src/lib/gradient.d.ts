// Type definitions for WebGL Gradient (Stripe-like) runtime
// These types match the current Gradient.js public surface the user provided.

export type RGBA = [number, number, number, number];
export type RGB = [number, number, number];

export interface GradientConfig {
  /** Start/stop animation on init (if supported by your build). */
  playing?: boolean;
  /** Particle density / quality hint (implementation-specific). */
  density?: number;
  /** Optional min width below which the canvas may adapt */
  minWidth?: number;
  /** Colors used for the animated gradient (as hex numbers like 0xff00aa or [r,g,b] tuples 0-1) */
  colors?: Array<number | RGB | RGBA>;
  /** Optional per-section color overrides */
  sectionColors?: Array<number | RGB | RGBA>;
}

export interface Size {
  width: number;
  height: number;
}

export declare class Gradient {
  /** The runtime does not consume constructor arguments. */
  constructor(canvas?: HTMLCanvasElement | string, config?: GradientConfig);

  /**
   * Initialize the gradient on a canvas.
   * Pass a CSS selector (e.g., "#stripe-canvas") or a canvas element.
   */
  initGradient(target: HTMLCanvasElement | string): void;

  /** Start/resume animation. Safe to call multiple times. */
  play(): void;

  /** Pause animation. Safe to call when already paused. */
  pause(): void;

  /** Attach internal listeners (resize/visibility). */
  connect(): void;

  /** Detach internal listeners. */
  disconnect(): void;

  /** Force a resize/layout recomputation and viewport update. */
  resize(): void;

  /** Update the active color palette at runtime (if supported by your build). */
  setColors?(
    colors: Array<number | RGB | RGBA>,
    sectionColors?: Array<number | RGB | RGBA>
  ): void;

  /** Enable/disable animation programmatically (if supported by your build). */
  setPlaying?(playing: boolean): void;

  /** Return current canvas size (if supported by your build). */
  getSize?(): Size;
}

export default Gradient;
