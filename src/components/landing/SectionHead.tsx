"use client";

import { useRef, type ReactNode } from "react";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/cn";
import styles from "./SectionHead.module.css";

type SectionHeadProps = {
  kicker: string;
  tone?: "brand" | "info";
  children: ReactNode;
  lede: ReactNode;
};

export function SectionHead({ kicker, tone = "brand", children, lede }: SectionHeadProps) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { threshold: 0.2, once: true });

  return (
    <div
      ref={ref}
      className={cn(styles.head, tone === "info" && styles.info, styles.rvh, seen && styles.in)}
    >
      <div>
        <p className={cn("eyebrow", styles.kicker)}>{kicker}</p>
        <h2 className={styles.title}>{children}</h2>
      </div>
      <p className={styles.lede}>{lede}</p>
    </div>
  );
}
