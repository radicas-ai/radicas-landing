"use client";

// "Built for where AI is going." — Today → Next roadmap. Ported from radicas_1.
import { useReveal } from "./useReveal";

const NEXT = ["Performance", "Governance", "Compliance"];

export function WhatsNext() {
  const { ref, cls } = useReveal<HTMLElement>();
  return (
    <section ref={ref} className={"section section-hairline " + cls} id="whats-next">
      <div className="container">
        <div className="tabs-head">
          <span className="eyebrow text-brand-primary-light">What&apos;s next</span>
          <h2 className="tabs-heading" style={{ marginTop: 16 }}>
            Built for where AI is going.
          </h2>
          <p className="tabs-intro">
            AI is evolving from a collection of tools into a core business infrastructure. Radicas is
            evolving with it.
          </p>
        </div>

        <div className="wn-road">
          <div className="wn-col wn-col--today">
            <span className="wn-tier today">
              <span className="wn-tier-dot" />
              Today
            </span>
            <div className="wn-layers">
              <div className="wn-layer today">
                <span className="wn-layer-name">Cost &amp; Value</span>
                <span className="wn-state">available now</span>
              </div>
            </div>
          </div>

          <div className="wn-flow" aria-hidden="true">
            <span className="wn-flow-arrow">→</span>
            <span className="wn-flow-label">evolving</span>
          </div>

          <div className="wn-col wn-col--next">
            <span className="wn-tier">
              <span className="wn-tier-dot next" />
              Next
            </span>
            <div className="wn-layers">
              {NEXT.map((name) => (
                <div className="wn-layer next" key={name}>
                  <span className="wn-layer-name">{name}</span>
                  <span className="wn-state">on the roadmap</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="wn-close">
          Today, Radicas helps you understand your AI spend. Tomorrow, it becomes the foundation for
          governing AI across your organization — <strong>the layer underneath everything AI touches.</strong>
        </p>
      </div>
    </section>
  );
}
