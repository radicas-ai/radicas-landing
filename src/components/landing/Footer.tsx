import Script from "next/script";
import { RadicasLogo } from "./Brand";
import styles from "./Contact.module.css";

const SECTION_LINKS = [
  { href: "#process", label: "Process" },
  { href: "#functions", label: "Functions" },
  { href: "#platform", label: "Platform" },
  { href: "#ai", label: "Copilot" },
  { href: "#framework", label: "Framework" },
  { href: "#integrations", label: "Integrations" },
  { href: "#contact", label: "Contact us" },
];

const PRIVACY_URL = "https://www.iubenda.com/privacy-policy/25436293";

export function Footer() {
  return (
    <div className={styles.foot}>
      <RadicasLogo className={styles.logo} />
      <nav aria-label="Footer">
        {SECTION_LINKS.map(({ href, label }) => (
          <a key={label} href={href}>
            {label}
          </a>
        ))}
        <a href={PRIVACY_URL} className="iubenda-noiframe iubenda-embed" title="Privacy Policy">
          Privacy
        </a>
        <a
          href={`${PRIVACY_URL}/cookie-policy`}
          className="iubenda-noiframe iubenda-embed"
          title="Cookie Policy"
        >
          Cookies
        </a>
      </nav>
      <span className={styles.cp}>© {new Date().getFullYear()} Radicas · Turin</span>
      {/* Turns the .iubenda-embed links above into modal-opening policy links. */}
      <Script src="https://cdn.iubenda.com/iubenda.js" strategy="afterInteractive" />
    </div>
  );
}
