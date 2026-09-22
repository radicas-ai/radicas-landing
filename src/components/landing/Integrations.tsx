"use client";

import { useState } from "react";
import { INTEGRATIONS_COPY, VENDORS, vendorMark, type Vendor } from "@/data/vendors";
import { useReveal } from "@/hooks/useReveal";
import { cn } from "@/lib/cn";
import { SectionHead } from "./SectionHead";
import reveal from "./reveal.module.css";
import styles from "./Integrations.module.css";

const ROW_ONE = VENDORS.filter((v) => v.cat === "ai" || v.cat === "tools" || v.cat === "fin");
const ROW_TWO = VENDORS.filter((v) => v.cat === "work" || v.cat === "people");

function Tile({ vendor }: { vendor: Vendor }) {
  const [broken, setBroken] = useState(false);
  return (
    <div className={styles.tile}>
      <span className={styles.c}>
        <em>{vendor.monogram}</em>
        {broken ? null : (
          <img
            src={vendorMark(vendor.domain)}
            alt=""
            loading="lazy"
            onError={() => setBroken(true)}
            suppressHydrationWarning
          />
        )}
      </span>
      <small>{vendor.name}</small>
    </div>
  );
}

/** The list is rendered twice so the -50% loop has no visible seam. */
function Marquee({ list, reverse, i }: { list: Vendor[]; reverse?: boolean; i: number }) {
  const { ref, seen, style } = useReveal<HTMLDivElement>(i);
  return (
    <div
      ref={ref}
      className={cn(styles.mq, reverse && styles.rev, reveal.rv, seen && reveal.in)}
      style={style}
    >
      <div className={styles.trk}>
        {[0, 1].map((pass) =>
          list.map((v) => <Tile key={`${pass}-${v.domain}`} vendor={v} />),
        )}
      </div>
    </div>
  );
}

export function Integrations() {
  const foot = useReveal<HTMLDivElement>();

  return (
    <section className={styles.section} id="integrations" aria-label="Integrations">
      <div className="wrap">
        <SectionHead kicker={INTEGRATIONS_COPY.kicker} lede={INTEGRATIONS_COPY.lede}>
          {INTEGRATIONS_COPY.headingLead} <em>{INTEGRATIONS_COPY.headingEmphasis}</em>
        </SectionHead>
      </div>

      <div className={styles.rows} aria-hidden>
        <Marquee list={ROW_ONE} i={0} />
        <Marquee list={ROW_TWO} reverse i={1} />
      </div>

      <div className="wrap">
        <div
          ref={foot.ref}
          className={cn(styles.foot, reveal.rv, foot.seen && reveal.in)}
          style={foot.style}
        >
          <span>{INTEGRATIONS_COPY.more}</span>
          <a className="btn btn-secondary" href="#contact">
            {INTEGRATIONS_COPY.cta}
          </a>
        </div>
      </div>
    </section>
  );
}
