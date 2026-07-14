// Trust & compliance band. Monoline icons in periwinkle; restrained Carbon cards.
// Ported from the /v2 TrustBand, without the shipped/roadmap status tags.

type Trust = { title: string; body: string; icon: string };

// 24×24 stroke paths (currentColor).
const ICONS: Record<string, string> = {
  globe: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18 M3 12h18 M12 3c2.5 2.5 2.5 15.5 0 18 M12 3c-2.5 2.5-2.5 15.5 0 18",
  shield: "M12 3 20 6v6c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V6z",
  doc: "M7 3h7l4 4v14H7z M14 3v4h4 M9.5 12h5 M9.5 15.5h5",
  key: "M14 7a3 3 0 1 1-3 3 M11 10l-7 7v3h3l1-1v-2h2v-2h2l.5-.5",
  eye: "M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6 Z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6",
  list: "M8 6h12 M8 12h12 M8 18h12 M4 6h.01 M4 12h.01 M4 18h.01",
};

const TRUST: Trust[] = [
  { icon: "globe", title: "EU-native data residency", body: "Hosted in the EU. Your AI traffic and ledger never leave the region." },
  { icon: "shield", title: "SOC 2", body: "Type II in progress. Controls mapped; report on the near-term roadmap." },
  { icon: "doc", title: "GDPR", body: "Built to GDPR from the ground up — lawful basis, DPA, and deletion on request." },
  { icon: "key", title: "SSO & RBAC", body: "SAML/OIDC single sign-on with role-based access across teams and entities." },
  { icon: "eye", title: "Shadow mode", body: "Observe and attribute before you enforce. Turn policy on when you're ready." },
  { icon: "list", title: "Audit trail & attribution", body: "Every call, cost, and policy decision is logged and attributable by ISO-8601." },
];

export function Trust() {
  return (
    <section id="security" className="section section-hairline">
      <div className="container">
        <div className="tabs-head">
          <span className="eyebrow text-brand-primary-light">trust</span>
          <h2 className="tabs-heading" style={{ marginTop: 16 }}>
            Built for teams that carry regulatory risk.
          </h2>
          <p className="tabs-intro">
            Precision over polish. Honest about what&apos;s shipped and what&apos;s on the roadmap.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {TRUST.map((t) => (
            <div key={t.title} className="flex flex-col gap-3 bg-bg-elevated p-6">
              <div className="flex items-center gap-3">
                <span className="text-brand-primary-light">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d={ICONS[t.icon]} />
                  </svg>
                </span>
                <h3 className="text-md font-medium text-fg">{t.title}</h3>
              </div>
              <p className="text-sm text-fg-muted">{t.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
