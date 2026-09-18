export interface LineGeometry {
  pts: [number, number][];
  d: string;
}

export interface ProjectionInput {
  hist: number[];
  fut: number[];
  base: number;
  rng: [number, number];
}

export interface ProjectionGeometry {
  w: number;
  h: number;
  baseY: number;
  histD: string;
  futD: string;
  dotX: number;
  dotY: number;
}

export function linePath(vals: number[], w: number, h: number, pad = 4): LineGeometry {
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const pts: [number, number][] = vals.map((v, i) => [
    pad + (i * (w - pad * 2)) / (vals.length - 1),
    pad + (1 - (v - min) / (max - min || 1)) * (h - pad * 2),
  ]);
  return { pts, d: pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ") };
}

export function projectionPath(p: ProjectionInput): ProjectionGeometry {
  const w = 520;
  const h = 100;
  const all = p.hist.concat(p.fut.slice(1));
  const [min, max] = p.rng;
  const x = (i: number) => 8 + (i * (w - 16)) / (all.length - 1);
  const y = (v: number) => 6 + (1 - (v - min) / (max - min)) * (h - 12);
  const path = (a: number[], off: number) =>
    a.map((v, i) => (i ? "L" : "M") + x(off + i).toFixed(1) + " " + y(v).toFixed(1)).join(" ");
  const last = p.hist.length - 1;
  return {
    w,
    h,
    baseY: y(p.base),
    histD: path(p.hist, 0),
    futD: path(p.fut, last),
    dotX: x(last),
    dotY: y(p.hist[last]),
  };
}

export function sparklinePath(vals: number[], w = 200, h = 30): string {
  return linePath(vals, w, h).d;
}
