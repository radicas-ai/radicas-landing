export interface FlyHandle {
  /** Resolves when the flight ends, whether it finished or was cancelled. */
  finished: Promise<void>;
  cancel: () => void;
  pause: () => void;
  play: () => void;
}

const NO_FLIGHT: FlyHandle = {
  finished: Promise.resolve(),
  cancel: () => {},
  pause: () => {},
  play: () => {},
};

/** Clones `from` and flies it onto `to`, removing the clone when it lands. */
export function flyClone(from: HTMLElement, to: HTMLElement, ms: number, className = "fly"): FlyHandle {
  // The Web Animations API ignores the global `animation: none` kill switch, so guard here.
  // `finished` still resolves, or the caller's state machine would stall.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return NO_FLIGHT;

  const a = from.getBoundingClientRect();
  const b = to.getBoundingClientRect();
  const clone = from.cloneNode(true) as HTMLElement;
  clone.className = className;
  // Document coordinates, so the clone scrolls with the page instead of detaching mid-flight.
  clone.style.cssText = `position:absolute;left:${a.left + window.scrollX}px;top:${a.top + window.scrollY}px;width:${a.width}px;height:${a.height}px;transform-origin:top left;pointer-events:none`;
  document.body.appendChild(clone);

  const anim = clone.animate(
    [
      { transform: "translate(0,0) scale(1,1)", opacity: 1 },
      {
        transform: `translate(${b.left - a.left}px,${b.top - a.top}px) scale(${b.width / a.width},${b.height / a.height})`,
        opacity: 0.9,
      },
    ],
    { duration: ms, easing: "cubic-bezier(.3,.6,.15,1)", fill: "forwards" },
  );

  let settle: () => void = () => {};
  const finished = new Promise<void>((resolve) => {
    settle = resolve;
  });
  const land = () => {
    clone.remove();
    settle();
  };
  anim.onfinish = land;

  return {
    finished,
    cancel: () => {
      anim.onfinish = null;
      anim.cancel();
      land();
    },
    pause: () => anim.pause(),
    play: () => anim.play(),
  };
}
