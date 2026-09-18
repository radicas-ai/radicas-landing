"use client";

import { useLayoutEffect, useRef, useState } from "react";
import styles from "./HowItWorks.module.css";

type Box = { x: number; y: number; w: number; h: number; cx: number; cy: number };
type Segment = { key: string; d: string; className?: string; delay?: string };
type Junction = { key: string; cx: number; cy: number };
type Geometry = { viewBox: string; feeds: Segment[]; junctions: Junction[]; fanout: Segment[] };

const cv = (x1: number, y1: number, x2: number, y2: number) => {
  const mx = (x1 + x2) / 2;
  return `M${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
};

const stagger = (i: number, step: number) => `${(-(i * step)).toFixed(2)}s`;

function measure(a: HTMLElement): Geometry | null {
  if (window.innerWidth <= 1040) return null;

  const mark = a.querySelector("[data-core]");
  const column = a.querySelector("[data-core-col]");
  const card = a.querySelector("[data-outc]");
  if (!mark || !column || !card) return null;

  const R = a.getBoundingClientRect();
  const rel = (el: Element): Box => {
    const r = el.getBoundingClientRect();
    return {
      x: r.left - R.left,
      y: r.top - R.top,
      w: r.width,
      h: r.height,
      cx: r.left - R.left + r.width / 2,
      cy: r.top - R.top + r.height / 2,
    };
  };

  const core = rel(mark);
  const col = rel(column);
  const oc = rel(card);
  const cy = core.cy;
  const inX = col.x - 4;
  const outX = col.x + col.w + 4;

  const feeds: Segment[] = [
    { key: "trunk-in", d: `M${inX} ${cy} H${core.x - 10}`, className: styles.trunk },
    { key: "trunk-out", d: `M${core.x + core.w + 10} ${cy} H${outX}`, className: styles.trunk },
  ];

  const rows = new Map<number, Box[]>();
  for (const node of a.querySelectorAll("[data-src-node]")) {
    const box = rel(node);
    const key = Math.round(box.cy);
    const bucket = rows.get(key);
    if (bucket) bucket.push(box);
    else rows.set(key, [box]);
  }
  const ys = [...rows.keys()].sort((p, q) => p - q);
  ys.forEach((y, i) => {
    const bucket = rows.get(y) ?? [];
    const first = bucket.reduce((m, b) => (b.cx < m.cx ? b : m));
    const last = bucket.reduce((m, b) => (b.cx > m.cx ? b : m));
    feeds.push({ key: `row-${y}`, d: `M${first.cx} ${y} H${last.cx}` });
    feeds.push({
      key: `feed-${y}`,
      d: cv(last.cx + 24, y, inX, cy),
      className: styles.flow,
      delay: stagger(i, 0.3),
    });
  });

  Array.from(a.querySelectorAll("[data-orow]")).forEach((node, i) => {
    feeds.push({
      key: `out-${i}`,
      d: cv(outX, cy, oc.x, rel(node).cy),
      className: styles.flow,
      delay: stagger(i, 0.25),
    });
  });

  const junctions: Junction[] = [
    { key: "j-in", cx: inX, cy },
    { key: "j-out", cx: outX, cy },
    { key: "j-fan", cx: oc.x + oc.w, cy },
  ];

  const fanout = Array.from(a.querySelectorAll("[data-fn]")).map((node, i) => {
    const f = rel(node);
    return {
      key: `fn-${i}`,
      d: cv(oc.x + oc.w, cy, f.x, f.cy),
      className: styles.flow,
      delay: stagger(i, 0.3),
    };
  });

  return { viewBox: `0 0 ${R.width} ${R.height}`, feeds, junctions, fanout };
}

/** Measured from the laid-out DOM, so it renders empty on the server and fills in after the first layout pass. */
export function Wire() {
  const [geo, setGeo] = useState<Geometry | null>(null);
  // The grid is read through the SVG's own parent: a ref owned by the parent is not yet
  // attached when a child's layout effect runs.
  const svgRef = useRef<SVGSVGElement>(null);

  useLayoutEffect(() => {
    const a = svgRef.current?.parentElement;
    if (!a) return;
    let live = true;
    const draw = () => {
      if (live) setGeo(measure(a));
    };

    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(a);
    window.addEventListener("resize", draw);
    // Web fonts land after first paint and shift every node the wire is pinned to.
    document.fonts.ready.then(draw, () => {});

    return () => {
      live = false;
      ro.disconnect();
      window.removeEventListener("resize", draw);
    };
  }, []);

  return (
    <svg ref={svgRef} className={styles.wire} viewBox={geo?.viewBox} aria-hidden>
      {geo?.feeds.map((s) => (
        <path key={s.key} className={s.className} d={s.d} style={s.delay ? { animationDelay: s.delay } : undefined} />
      ))}
      {geo?.junctions.map((j) => (
        <circle key={j.key} className={styles.j} cx={j.cx} cy={j.cy} r={3.5} />
      ))}
      {geo?.fanout.map((s) => (
        <path key={s.key} className={s.className} d={s.d} style={s.delay ? { animationDelay: s.delay } : undefined} />
      ))}
    </svg>
  );
}
