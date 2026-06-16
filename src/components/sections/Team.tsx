// Team section — placeholder members. Replace the TEAM entries below with real
// people (name, role, optional photo + links) as they're confirmed.

type TeamMember = {
  name: string;
  role: string;
  /** Path under /public or absolute URL. Leave empty to show initials. */
  photo?: string;
  /** One-line bio — optional. */
  bio?: string;
  linkedin?: string;
};

const TEAM: TeamMember[] = [
  { name: "Add a name", role: "Co-founder & CEO", bio: "Short one-line bio goes here." },
  { name: "Add a name", role: "Co-founder & CTO", bio: "Short one-line bio goes here." },
  { name: "Add a name", role: "Founding Engineer", bio: "Short one-line bio goes here." },
  { name: "Add a name", role: "Head of Design", bio: "Short one-line bio goes here." },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function Team() {
  return (
    <section id="team" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20 sm:py-28">
      <div className="max-w-2xl">
        <p className="eyebrow text-fg-subtle">who we are</p>
        <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
          The team behind the layer.
        </h2>
        <p className="mt-4 text-md text-fg-muted">
          The people building the runtime control plane for enterprise AI.
        </p>
      </div>

      <ul className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {TEAM.map((member, i) => (
          <li key={i} className="flex flex-col items-start gap-4 bg-bg-elevated p-6">
            {member.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={member.photo}
                alt={member.name}
                className="h-16 w-16 rounded-pill object-cover"
              />
            ) : (
              <div
                aria-hidden="true"
                className="flex h-16 w-16 items-center justify-center rounded-pill border border-border bg-bg font-mono text-sm uppercase tracking-caps text-fg-subtle"
              >
                {initials(member.name)}
              </div>
            )}
            <div className="flex flex-col gap-1">
              <span className="text-md font-medium text-fg">{member.name}</span>
              <span className="font-mono text-2xs uppercase tracking-caps text-brand-primary">
                {member.role}
              </span>
            </div>
            {member.bio && <p className="text-sm text-fg-muted">{member.bio}</p>}
            {member.linkedin && (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-fg-subtle transition-colors hover:text-fg"
              >
                LinkedIn →
              </a>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
