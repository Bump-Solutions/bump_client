import React, { ReactNode } from "react";

type Range = [number, number];

export function mergeRanges(ranges: Range[]): Range[] {
  if (!ranges.length) return [];
  const sorted = [...ranges].sort((a, b) => a[0] - b[0]);
  const out: Range[] = [];
  let [s, e] = sorted[0];
  for (let i = 1; i < sorted.length; i++) {
    const [ns, ne] = sorted[i];
    if (ns <= e + 1) {
      e = Math.max(e, ne); // összevonás átfedésnél/érintkezésnél
    } else {
      out.push([s, e]);
      [s, e] = [ns, ne];
    }
  }
  out.push([s, e]);
  return out;
}

export function highlightTextParts(
  text: string,
  ranges?: Range[]
): ReactNode[] {
  if (!ranges?.length) return [text];

  const merged = mergeRanges(ranges);
  const parts: ReactNode[] = [];
  let prevEnd = -1;

  merged.forEach(([start, end], idx) => {
    if (start > prevEnd + 1) {
      parts.push(text.slice(prevEnd + 1, start));
    }
    parts.push(
      React.createElement("mark", { key: idx }, text.slice(start, end + 1))
    );
    prevEnd = end;
  });

  if (prevEnd < text.length - 1) {
    parts.push(text.slice(prevEnd + 1));
  }

  return parts;
}
