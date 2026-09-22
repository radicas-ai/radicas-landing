export type VendorCategory = "ai" | "tools" | "work" | "people" | "fin";

export interface Vendor {
  cat: VendorCategory;
  /** Drives the brand mark lookup; the monogram shows through when it fails to load. */
  domain: string;
  name: string;
  monogram: string;
}

export const VENDORS: Vendor[] = [
  { cat: "ai", domain: "anthropic.com", name: "Anthropic", monogram: "An" },
  { cat: "ai", domain: "openai.com", name: "OpenAI", monogram: "OA" },
  { cat: "ai", domain: "azure.microsoft.com", name: "Azure OpenAI", monogram: "AO" },
  { cat: "ai", domain: "aws.amazon.com", name: "AWS Bedrock", monogram: "AB" },
  { cat: "ai", domain: "cloud.google.com", name: "Vertex AI", monogram: "VA" },
  { cat: "ai", domain: "mistral.ai", name: "Mistral", monogram: "Mi" },
  { cat: "ai", domain: "openrouter.ai", name: "OpenRouter", monogram: "OR" },
  { cat: "tools", domain: "claude.ai", name: "Claude Code", monogram: "CC" },
  { cat: "tools", domain: "cursor.com", name: "Cursor", monogram: "Cu" },
  { cat: "tools", domain: "chatgpt.com", name: "ChatGPT", monogram: "CG" },
  { cat: "fin", domain: "netsuite.com", name: "NetSuite", monogram: "NS" },
  { cat: "fin", domain: "sap.com", name: "SAP", monogram: "SA" },
  { cat: "fin", domain: "stripe.com", name: "Stripe", monogram: "St" },
  { cat: "work", domain: "linear.app", name: "Linear", monogram: "Li" },
  { cat: "work", domain: "github.com", name: "GitHub", monogram: "GH" },
  { cat: "work", domain: "atlassian.com", name: "Jira", monogram: "Jr" },
  { cat: "work", domain: "zendesk.com", name: "Zendesk", monogram: "Zd" },
  { cat: "work", domain: "intercom.com", name: "Intercom", monogram: "Ic" },
  { cat: "work", domain: "servicenow.com", name: "ServiceNow", monogram: "SN" },
  { cat: "work", domain: "salesforce.com", name: "Salesforce", monogram: "Sf" },
  { cat: "work", domain: "hubspot.com", name: "HubSpot", monogram: "Hs" },
  { cat: "work", domain: "gong.io", name: "Gong", monogram: "Go" },
  { cat: "work", domain: "slack.com", name: "Slack", monogram: "Sl" },
  { cat: "people", domain: "okta.com", name: "Okta", monogram: "Ok" },
  { cat: "people", domain: "microsoft.com", name: "Entra ID", monogram: "En" },
  { cat: "people", domain: "workday.com", name: "Workday", monogram: "Wd" },
];

/** Brand marks come from the public favicon service, as in the approved mock. */
export function vendorMark(domain: string): string {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
}

export const INTEGRATIONS_COPY = {
  kicker: "Integrations",
  headingLead: "Connected to everything",
  headingEmphasis: "you already run.",
  lede:
    "AI providers, the tools your teams use and the systems where the work happens. One model on top of all of them.",
  more: "+ 30 more connectors",
  cta: "See all connectors",
};
