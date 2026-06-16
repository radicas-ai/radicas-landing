// The layer, in three guarantees — a full-bleed brand band between the
// control-plane visual ("One layer beneath every call") and the capability
// tabs ("What the layer does").

const GUARANTEES = [
  {
    num: "01",
    title: "See what’s running.",
    body: "Every vendor, model, and agent — discovered and inventoried in one place, including the shadow usage no one declared.",
  },
  {
    num: "02",
    title: "Know what it costs.",
    body: "Token, seat, and consumption spend attributed to the team, agent, and decision that incurred it — live, to the cent.",
  },
  {
    num: "03",
    title: "Prove it’s in policy.",
    body: "Every call checked against your rules at runtime — allowed, flagged, or denied, with an audit trail you can hand to risk.",
  },
];

export function ThreeGuarantees() {
  return (
    <section className="section tg" id="three-guarantees">
      <div className="container">
        <p className="tg-eyebrow">
          <span className="dot" />
          The layer, in three guarantees
        </p>
        <div className="tg-grid">
          {GUARANTEES.map((g) => (
            <div className="tg-col" key={g.num}>
              <span className="tg-num">{g.num}</span>
              <h3 className="tg-h">{g.title}</h3>
              <p className="tg-p">{g.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
