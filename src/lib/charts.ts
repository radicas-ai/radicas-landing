/** Polyline through `vals`, scaled to a `w`×`h` box. */
export function sparklinePath(vals: number[], w = 200, h = 30, pad = 4): string {
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  return vals
    .map((v, i) => {
      const x = pad + (i * (w - pad * 2)) / (vals.length - 1);
      const y = pad + (1 - (v - min) / (max - min || 1)) * (h - pad * 2);
      return `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}
