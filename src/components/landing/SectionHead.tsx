import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import styles from "./SectionHead.module.css";

type SectionHeadProps = {
  kicker: string;
  tone?: "brand" | "info";
  children: ReactNode;
  lede: ReactNode;
};

export function SectionHead({ kicker, tone = "brand", children, lede }: SectionHeadProps) {
  return (
    <div className={cn(styles.head, tone === "info" && styles.info)}>
      <div>
        <p className={cn("eyebrow", styles.kicker)}>{kicker}</p>
        <h2 className={styles.title}>{children}</h2>
      </div>
      <p className={styles.lede}>{lede}</p>
    </div>
  );
}
