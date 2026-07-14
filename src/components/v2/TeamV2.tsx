// Team section — Radicas co-founders. Initials avatars until photos are added
// (drop images in /public and set `photo` to swap them in).
type Member = {
  name: string;
  role: string;
  linkedin: string;
  photo?: string;
  /** Per-photo framing so faces sit at a consistent scale. */
  zoom?: number;
  pos?: string;
  /** Fill shown around a scaled-down photo (matches its own backdrop). */
  bg?: string;
};

const TEAM: Member[] = [
  { name: "Marihum Pernia", role: "Co-Founder & CEO", linkedin: "https://www.linkedin.com/in/marihum-pernia/", photo: "/team/marihum.jpg", zoom: 1.42, pos: "center 26%" },
  { name: "Francesco Fiore", role: "Co-Founder & CTO", linkedin: "https://www.linkedin.com/in/francesco-fio/", photo: "/team/francesco.jpg", zoom: 1.16, pos: "center 10%" },
  { name: "Meike Bingemann", role: "Co-Founder & COO", linkedin: "https://www.linkedin.com/in/meike-bingemann/", photo: "/team/meike.png", zoom: 0.9, pos: "center 38%", bg: "#f4f4f6" },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1-.02-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.3 0-2.95-1.8-2.95-1.8 0-2.08 1.4-2.08 2.85V21H9z" />
    </svg>
  );
}

export function TeamV2() {
  return (
    <section id="team" className="section section-hairline">
      <div className="container">
        <div className="tabs-head">
          <span className="eyebrow text-brand-primary-light">the team</span>
          <h2 className="tabs-heading" style={{ marginTop: 16 }}>
            The founders behind Radicas.
          </h2>
          <p className="tabs-intro">
            Building the financial layer for the AI era — from the EU.
          </p>
        </div>

        <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3">
          {TEAM.map((m) => (
            <li key={m.name} className="flex flex-col items-start gap-4 bg-bg-elevated p-6">
              {m.photo ? (
                <div
                  className="aspect-square w-full overflow-hidden rounded-lg border border-border"
                  style={m.bg ? { background: m.bg } : undefined}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={m.photo}
                    alt={m.name}
                    className="h-full w-full object-cover"
                    style={{
                      filter: "grayscale(1) contrast(1.02)",
                      objectPosition: m.pos ?? "center 20%",
                      transform: `scale(${m.zoom ?? 1})`,
                    }}
                  />
                </div>
              ) : (
                <div
                  aria-hidden="true"
                  className="flex aspect-square w-full items-center justify-center rounded-lg border border-border bg-bg font-mono text-2xl uppercase tracking-caps text-brand-primary-light"
                >
                  {initials(m.name)}
                </div>
              )}
              <div className="flex flex-col gap-1">
                <span className="text-md font-medium text-fg">{m.name}</span>
                <span className="font-mono text-2xs uppercase tracking-caps text-brand-primary">
                  {m.role}
                </span>
              </div>
              <a
                href={m.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${m.name} on LinkedIn`}
                className="mt-auto inline-flex items-center gap-2 text-sm text-fg-subtle transition-colors hover:text-fg"
              >
                <LinkedInIcon />
                LinkedIn
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
