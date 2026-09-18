import type { FunctionId } from "@/data/functions";

export type DeclarationKey = "budget" | "owner" | "rule" | "policy";

export type OutputKey = "chart" | "info" | "bell" | "shield" | "ledger";

export interface Declaration {
  key: DeclarationKey;
  name: string;
}

export interface Output {
  key: OutputKey;
  title: string;
  desc: string;
  badge: string;
  cls: string;
}

export interface HowFunction {
  key: FunctionId;
  name: string;
  unit: string;
  colour: string;
}

export interface CoreStackLayer {
  label: string;
  hi?: boolean;
}

export const DECLARATIONS: Declaration[] = [
  { key: "budget", name: "Budgets" },
  { key: "owner", name: "Owners" },
  { key: "rule", name: "Rulebook" },
  { key: "policy", name: "Policies" },
];

export const OUTPUTS: Output[] = [
  {
    key: "chart",
    title: "Numbers & projections",
    desc: "KPIs · trends · forecast · scenarios",
    badge: "Output",
    cls: "",
  },
  {
    key: "info",
    title: "Explanations & recommendations",
    desc: "why it moved · scale, optimise or stop",
    badge: "Output",
    cls: "",
  },
  {
    key: "bell",
    title: "Alerts",
    desc: "the moment a rule fires · evidence attached",
    badge: "Act",
    cls: "act",
  },
  {
    key: "shield",
    title: "Enforcement",
    desc: "caps · routing · approvals",
    badge: "Advanced",
    cls: "act adv",
  },
  {
    key: "ledger",
    title: "Audit ledger",
    desc: "every number and action, under its rule version",
    badge: "Output",
    cls: "",
  },
];

export const HOW_FUNCTIONS: HowFunction[] = [
  { key: "eng", name: "Engineering & Product", unit: "per shipped task", colour: "#7571EB" },
  { key: "cs", name: "Customer service", unit: "per resolved ticket", colour: "#00B8CC" },
  { key: "sales", name: "Sales", unit: "per advanced deal", colour: "#4F4BC4" },
  { key: "hr", name: "HR", unit: "per answered query", colour: "#232A40" },
];

export const CORE_STACK: CoreStackLayer[] = [
  { label: "Strategic framework", hi: true },
  { label: "Data model · six families" },
  { label: "Business rules" },
  { label: "Radicas AI", hi: true },
  { label: "Governance rules" },
];

export const HOW_COPY = {
  kicker: "How it works",
  headingLead: "Everything you already run,",
  headingEmphasis: "one model, what you get.",
  lede: "Your systems and your declarations feed one model. Rules written once turn it into numbers, explanations, alerts and rules, for every function.",
  columns: ["Your systems & declarations", "Radicas", "What you get", "For every function"],
  more: "+ 30 more connectors",
  coreTitle: "One model · rules written once",
  outputsTitle: "What you get",
  loopLabel: "Loop",
  loopNote: "outcomes and actions re-enter the model",
};
