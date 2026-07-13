"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Adds an `in` class once the element scrolls into view (mirrors the standalone
 * artifact's IntersectionObserver reveal). Returns a ref and the class string.
 */
export function useReveal<T extends Element>(threshold = 0.2) {
  const ref = useRef<T | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || shown) return;
    if (!("IntersectionObserver" in window)) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShown(true);
            io.unobserve(e.target);
          }
        });
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [shown, threshold]);

  return { ref, cls: shown ? "in" : "" };
}
