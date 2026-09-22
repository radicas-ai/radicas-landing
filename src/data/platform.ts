// Three foundations. Illustrative figures.

export type PlatformRowKey = "estate" | "map" | "gov";

export interface PlatformRow {
  k: PlatformRowKey;
  num: string;
  name: string;
  desc: string;
}

export const PLATFORM_ROWS: PlatformRow[] = [
  {
    k: "estate",
    num: "01",
    name: "AI estate",
    desc: "Every vendor, tool, seat and agent. One inventory that matches the bill.",
  },
  {
    k: "map",
    num: "02",
    name: "Cost per unit of work",
    desc:
      "People and agents on the same work. One AI cost per unit, with how often people step in.",
  },
  {
    k: "gov",
    num: "03",
    name: "Governance",
    desc:
      "The controls you get on every AI system, watched by agents, with every action on record.",
  },
];

export const PLATFORM_COPY = {
  kicker: "Radicas core",
  headingLead: "Three foundations.",
  headingEmphasis: "One workforce.",
  lede:
    "AI now works next to your people. We designed Radicas around three things that follow from that: the estate you run, the work they share, and the rules that keep it in check.",
};

/** 01 — what feeds the inventory. */
export interface SourceGroup {
  label: string;
  chips: string[];
  more: string;
}

export const SOURCE_GROUPS: SourceGroup[] = [
  { label: "Model providers", chips: ["Anthropic", "OpenAI", "Azure OpenAI"], more: "+9" },
  { label: "Tools and seats", chips: ["Claude Code", "Cursor", "ChatGPT"], more: "+14" },
  { label: "Agents", chips: ["Planner", "Reviewer", "Support bot"], more: "+17" },
  { label: "Invoices", chips: ["Monthly bills", "Commitments"], more: "+6" },
];

export const SOURCE_ANY = "+ any system you connect";

export const ESTATE_CARD = {
  eyebrow: "One AI estate",
  title: "Every AI system, in one place.",
  points: ["An owner for each one", "Matches the bill"],
};

/** 02 — who does the work. */
export const MAP_CARD = {
  eyebrow: "One unit of work",
  value: "€2.41",
  sub: "per shipped task",
};

export const MAP_SIDES = [
  { k: "user" as const, label: "People" },
  { k: "bot" as const, label: "AI agents" },
];

/** 03 — the controls, and how they are supported. */
export interface Control {
  icon: string;
  name: string;
  desc: string;
  advanced?: boolean;
}

export const CONTROLS: Control[] = [
  { icon: "user", name: "Ownership", desc: "A named owner for every system, agent and rule." },
  {
    icon: "gauge",
    name: "Budgets and thresholds",
    desc: "Per team, agent or model. Alerted before they break.",
  },
  { icon: "list", name: "Usage policies", desc: "Which models and vendors each function may use." },
  { icon: "target", name: "Unit-cost targets", desc: "A target cost per task, ticket or deal." },
  { icon: "book", name: "Audit trail", desc: "Every figure and action, under its rule version." },
  {
    icon: "zap",
    name: "Enforcement",
    desc: "Caps, routing and approvals, applied for you.",
    advanced: true,
  },
];

export interface Support {
  icon: string;
  text: string;
  advanced?: boolean;
}

export const SUPPORT: Support[] = [
  { icon: "eye", text: "Agents that watch" },
  { icon: "ver", text: "Versioned rules" },
  { icon: "bill", text: "Reconciled to the bill" },
  { icon: "clip", text: "Evidence on every alert" },
  { icon: "zap", text: "Agents that act · advanced", advanced: true },
];

export const SUPPORT_LABEL = "How we support it";
export const ADVANCED_LABEL = "Advanced step";
