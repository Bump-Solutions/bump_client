/**
 * Kényelmi wrapper: ha nincs range, egyetlen <span>-t ad vissza,
 * különben összeilleszti a highlightolt darabokat.
 */

import { JSX } from "react";
import { Range, highlightTextParts } from "../utils/highlight";

type AsTag = keyof JSX.IntrinsicElements | "fragment";

interface HighlightedProps {
  text: string;
  ranges?: Range[];
  className?: string;
  /** ha fragment → nem kerül wrapper, csak fragment */
  as?: AsTag;
}

const Highlighted = ({
  text,
  ranges,
  className,
  as = "fragment",
}: HighlightedProps) => {
  const nodes = highlightTextParts(text, ranges);

  if (as === "fragment") {
    // wrapper nélküli render
    return <>{nodes}</>;
  }

  const Tag = as;
  return <Tag className={className}>{nodes}</Tag>;
};

export default Highlighted;
