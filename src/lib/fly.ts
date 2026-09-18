export interface FlyHandle {
  /** Resolves when the flight ends, whether it finished or was cancelled. */
  finished: Promise<void>;
  cancel: () => void;
}

/** Clones `from` and flies it onto `to`, removing the clone when it lands. */
export function flyClone(from: HTMLElement, to: HTMLElement, ms: number, className = "fly"): FlyHandle {
  const a = from.getBoundingClientRect();
  const b = to.getBoundingClientRect();
  const clone = from.cloneNode(true) as HTMLElement;
  clone.className = className;
  clone.style.cssText = `position:fixed;left:${a.left}px;top:${a.top}px;width:${a.width}px;height:${a.height}px;transform-origin:top left;pointer-events:none`;
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
  };
}
