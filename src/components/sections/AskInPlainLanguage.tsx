// Ported from the original landing (app.jsx › AskRadicas).
import { PhoneChat } from "@/components/demo/PhoneChat";

export function AskInPlainLanguage() {
  return (
    <section className="section section-hairline ask-section" id="ask">
      <div className="container ask-grid">
        <div className="ask-copy">
          <div className="eyebrow">ask, don&apos;t dig</div>
          <h2 className="ask-heading" style={{ marginTop: "16px" }}>
            Ask in plain language — wherever you already work.
          </h2>
          <p className="ask-body">
            Radicas answers <em>multimodally</em>: the numbers, the chart, and the diagnosis, in the
            tools your teams already live in. It connects to the LLMs you use and to Slack and Teams
            over <strong>MCP</strong> — so your agents can reach Radicas the same way.
          </p>
          <div className="ask-intg">
            <div className="intg-group">
              <span className="gl">models</span>
              <span className="intg">
                <span className="gd" style={{ background: "#D97757" }}></span>Claude
              </span>
              <span className="intg">
                <span className="gd" style={{ background: "#10A37F" }}></span>ChatGPT
              </span>
              <span className="intg">
                <span className="gd" style={{ background: "#4285F4" }}></span>Gemini
              </span>
              <span className="intg">
                <span className="gd" style={{ background: "#20B8CD" }}></span>Perplexity
              </span>
            </div>
            <div className="intg-group">
              <span className="gl">workspaces</span>
              <span className="intg">
                <span className="gd" style={{ background: "#E01E5A" }}></span>Slack
              </span>
              <span className="intg">
                <span className="gd" style={{ background: "#6264A7" }}></span>Teams
              </span>
            </div>
            <div className="intg-group">
              <span className="gl">protocol</span>
              <span className="intg mcp">
                <span className="gd" style={{ background: "var(--brand-primary)" }}></span>MCP · agents
                connect too
              </span>
            </div>
          </div>
        </div>
        <div className="ask-phone-wrap">
          <PhoneChat theme="carbon" />
        </div>
      </div>
    </section>
  );
}
