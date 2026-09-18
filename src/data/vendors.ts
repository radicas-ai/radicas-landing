export type Vendor = {
  slug: string;
  name: string;
  monogram: string;
  /** Set only where a licensed brand mark ships in `public/vendors`; otherwise the monogram stands in. */
  file?: string;
};

export const VENDORS: Vendor[] = [
  { slug: "okta", name: "Okta", monogram: "Ok", file: "/vendors/okta.svg" },
  { slug: "entra", name: "Entra ID", monogram: "En" },
  { slug: "linear", name: "Linear", monogram: "Li", file: "/vendors/linear.svg" },
  { slug: "github", name: "GitHub", monogram: "GH", file: "/vendors/github.svg" },
  { slug: "jira", name: "Jira", monogram: "Jr", file: "/vendors/jira.svg" },
  { slug: "zendesk", name: "Zendesk", monogram: "Zd", file: "/vendors/zendesk.svg" },
  { slug: "intercom", name: "Intercom", monogram: "Ic", file: "/vendors/intercom.svg" },
  { slug: "salesforce", name: "Salesforce", monogram: "Sf", file: "/vendors/salesforce.svg" },
  { slug: "hubspot", name: "HubSpot", monogram: "Hs", file: "/vendors/hubspot.svg" },
  { slug: "workday", name: "Workday", monogram: "Wd" },
  { slug: "anthropic", name: "Anthropic", monogram: "An", file: "/vendors/anthropic.svg" },
  { slug: "openai", name: "OpenAI", monogram: "OA", file: "/vendors/openai.svg" },
  { slug: "azure-openai", name: "Azure OpenAI", monogram: "Az", file: "/vendors/azure-openai.svg" },
  { slug: "openrouter", name: "OpenRouter", monogram: "OR", file: "/vendors/openrouter.svg" },
  { slug: "claude", name: "Claude Code", monogram: "CC", file: "/vendors/claude.svg" },
  { slug: "cursor", name: "Cursor", monogram: "Cu", file: "/vendors/cursor.svg" },
];
