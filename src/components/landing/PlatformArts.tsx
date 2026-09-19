"use client";

import type { ReactNode } from "react";
import {
  CONTROLS,
  ESTATE_CARD,
  MAP_CARD,
  MAP_SIDES,
  SOURCE_ANY,
  SOURCE_GROUPS,
  type PlatformRowKey,
} from "@/data/platform";
import { cn } from "@/lib/cn";
import { ADVANCED_LABEL } from "@/data/platform";
import { CHECK, PLATFORM_ICONS, Icon } from "./icons";
import styles from "./Platform.module.css";

/** Curved connectors from each source row into the single card on the right. */
function Fan({ w, h, ys, to }: { w: number; h: number; ys: number[]; to: number }) {
  return (
    <svg className={styles.lk} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden>
      {ys.map((y) => (
        <path key={y} d={`M0 ${y} C ${w * 0.55} ${y}, ${w * 0.45} ${to}, ${w} ${to}`} />
      ))}
    </svg>
  );
}

function Piece({ on, children }: { on: boolean; children: ReactNode }) {
  return <div className={cn(styles.rv, on && styles.in)}>{children}</div>;
}

function Estate({ on }: { on: boolean }) {
  return (
    <div className={styles.est}>
      <div className={styles.src}>
        {SOURCE_GROUPS.map((g) => (
          <Piece key={g.label} on={on}>
            <div className={styles.grp}>
              <span className="eyebrow">{g.label}</span>
              <span className={styles.cs}>
                {g.chips.map((c) => (
                  <span key={c}>{c}</span>
                ))}
                <span className={styles.more}>{g.more}</span>
              </span>
            </div>
          </Piece>
        ))}
        <Piece on={on}>
          <div className={cn(styles.grp, styles.etc)}>
            <span>{SOURCE_ANY}</span>
          </div>
        </Piece>
      </div>
      <div className={styles.mid}>
        <Fan w={72} h={300} ys={[29, 97, 165, 233, 285]} to={150} />
      </div>
      <Piece on={on}>
        <div className={styles.inv}>
          <span className="eyebrow">{ESTATE_CARD.eyebrow}</span>
          <b>{ESTATE_CARD.title}</b>
          <ul>
            {ESTATE_CARD.points.map((p) => (
              <li key={p}>
                <Icon paths={CHECK} />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </Piece>
    </div>
  );
}

function Map({ on }: { on: boolean }) {
  return (
    <div className={styles.est}>
      <div className={styles.src}>
        {MAP_SIDES.map((s) => (
          <Piece key={s.label} on={on}>
            <div className={cn(styles.grp, styles.pe)}>
              <span className={cn(styles.ic2, s.k === "bot" && styles.agents)}>
                <Icon paths={PLATFORM_ICONS[s.k]} />
                <Icon paths={PLATFORM_ICONS[s.k]} />
              </span>
              <b>{s.label}</b>
            </div>
          </Piece>
        ))}
      </div>
      <div className={cn(styles.mid, styles.short)}>
        <Fan w={72} h={136} ys={[29, 107]} to={68} />
      </div>
      <Piece on={on}>
        <div className={styles.inv}>
          <span className="eyebrow">{MAP_CARD.eyebrow}</span>
          <div className={styles.big5}>{MAP_CARD.value}</div>
          <span className={styles.sub5}>{MAP_CARD.sub}</span>
        </div>
      </Piece>
    </div>
  );
}

function Governance({ on }: { on: boolean }) {
  return (
    <div className={styles.gctl}>
      {CONTROLS.map((c) => (
        <Piece key={c.name} on={on}>
          <div className={cn(styles.ctl, c.advanced && styles.advanced)}>
            <span className={styles.av}>
              <Icon paths={PLATFORM_ICONS[c.icon]} />
            </span>
            <span>
              <b>
                {c.name}
                {c.advanced ? <em className={styles.lock}>{ADVANCED_LABEL}</em> : null}
              </b>
              <span>{c.desc}</span>
            </span>
          </div>
        </Piece>
      ))}
    </div>
  );
}

export const PLATFORM_ARTS: Record<PlatformRowKey, (p: { on: boolean }) => ReactNode> = {
  estate: Estate,
  map: Map,
  gov: Governance,
};
