import { Wordmark } from "./Mark";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-12 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <Wordmark />
          <p className="max-w-xs text-sm text-fg-subtle">
            The runtime control plane for enterprise AI. EU-native.
          </p>
        </div>
        <div className="flex flex-col gap-3 text-sm text-fg-muted sm:items-end">
          <div className="flex gap-5">
            <a href="#what-it-does" className="transition-colors hover:text-fg">
              Product
            </a>
            <a href="#ask" className="transition-colors hover:text-fg">
              How it works
            </a>
            <a href="#contact" className="transition-colors hover:text-fg">
              Contact
            </a>
          </div>
          <p className="font-mono text-2xs uppercase tracking-caps text-fg-subtle">
            © {new Date().getFullYear()} Radicas · the layer underneath
          </p>
        </div>
      </div>
    </footer>
  );
}
