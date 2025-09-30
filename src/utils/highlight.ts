import React from "react";

export type Range = [number, number];
export type FieldMatches = Record<string, Range[]>;
export type HighlightIndex = {
  perSeller?: Record<number, FieldMatches>;
  perProduct?: Record<number, FieldMatches>;
  perItem?: Record<number, FieldMatches>;
};

/** Összevonja az átfedő/érintkező tartományokat. */
export function mergeRanges(ranges: Range[]): Range[] {
  if (!ranges || ranges.length === 0) return [];
  const sorted = [...ranges].sort((a, b) => a[0] - b[0]);
  const out: Range[] = [];
  let [s, e] = sorted[0];

  for (let i = 1; i < sorted.length; i++) {
    const [ns, ne] = sorted[i];
    if (ns <= e + 1) {
      e = Math.max(e, ne);
    } else {
      out.push([s, e]);
      [s, e] = [ns, ne];
    }
  }
  out.push([s, e]);
  return out;
}

/** Biztonsági vágás: tartományok beszűkítése a szöveg hosszához. */
function clampRangesToText(text: string, ranges: Range[]): Range[] {
  const L = text.length;
  return ranges
    .map(([s, e]) => [Math.max(0, s), Math.min(L - 1, e)] as Range)
    .filter(([s, e]) => s <= e && s < L && e >= 0);
}

/**
 * Kiemelés: egy stringet darabol részekre és <mark>-olja a megadott tartományokat.
 * Visszatérési érték: ReactNode[] – közvetlenül be tudod szúrni JSX-be.
 *
 * Megjegyzés: a Fuse-ban az `indices` [start, end] **inkluzív**.
 */
export function highlightTextParts(
  text: string,
  ranges?: Range[]
): React.ReactNode[] {
  if (!ranges || ranges.length === 0) return [text];

  const merged = mergeRanges(clampRangesToText(text, ranges));
  if (merged.length === 0) return [text];

  const parts: React.ReactNode[] = [];
  let prevEnd = -1;

  merged.forEach(([start, end], idx) => {
    // normál szöveg a találat előtt
    if (start > prevEnd + 1) {
      parts.push(text.slice(prevEnd + 1, start));
    }
    // találat kiemelve
    parts.push(
      React.createElement(
        "mark",
        { key: `hit-${idx}` },
        text.slice(start, end + 1)
      )
    );
    prevEnd = end;
  });

  // farok
  if (prevEnd < text.length - 1) {
    parts.push(text.slice(prevEnd + 1));
  }

  return parts;
}
