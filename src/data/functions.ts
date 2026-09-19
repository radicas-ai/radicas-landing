// Illustrative. One engine, one framework: what changes per function is the unit of work.

export type FunctionId = "eng" | "cs" | "sales" | "hr" | "fin";

export interface FunctionData {
  id: FunctionId;
  name: string;
  /** The promise, in the buyer's words. */
  tag: string;
  colour: string;
  unit: string;
  outcome: string;
  systems: string;
  q: string;
}

export const FUNCTIONS: FunctionData[] = [
  {
    id: "eng",
    name: "Engineering & Product",
    tag: "Ship faster, at a known cost per task.",
    colour: "#7571EB",
    unit: "Task",
    outcome: "Shipped / merged",
    systems: "Linear, GitHub, Jira",
    q: "What does AI cost per shipped task, and how much of it is rework?",
  },
  {
    id: "cs",
    name: "Customer service",
    tag: "Faster, better support at a lower cost.",
    colour: "#00B8CC",
    unit: "Ticket",
    outcome: "Resolved / not reopened",
    systems: "Zendesk, ServiceNow, Intercom",
    q: "What does AI cost per resolved ticket, and where do people still step in?",
  },
  {
    id: "sales",
    name: "Sales",
    tag: "Spend AI where it moves deals.",
    colour: "#4F4BC4",
    unit: "Deal",
    outcome: "Stage advanced / closed",
    systems: "Salesforce, HubSpot, Gong",
    q: "What does AI cost per advanced deal, and which steps actually move it?",
  },
  {
    id: "hr",
    name: "HR",
    tag: "Faster answers and hires, at a known cost.",
    colour: "#D69520",
    unit: "Employee query",
    outcome: "Answered / resolved",
    systems: "Workday, ATS",
    q: "What does AI cost per answered employee query?",
  },
  {
    id: "fin",
    name: "Finance",
    tag: "A faster close, at a known cost.",
    colour: "#00A378",
    unit: "Invoice",
    outcome: "Processed / reconciled",
    systems: "ERP, AP automation",
    q: "What does AI cost per processed invoice, and what still needs review?",
  },
];

/** The layers every function shares — they light in sequence on each switch. */
export const INTEL_BLOCKS: string[] = [
  "Radicas Framework",
  "Data model",
  "Business rules",
  "Governance rules",
  "Radicas AI",
];

export const FUNCTIONS_COPY = {
  kicker: "One engine, every function",
  headingLead: "Different work.",
  headingEmphasis: "The same intelligence.",
  lede:
    "Tasks, tickets, deals: different work, one engine. The same framework, data model and copilot show what each costs, why, and what it returns.",
  intelKicker: "Radicas intelligence",
  intelTitle: "The same for every function.",
  attrUnit: "Unit of work",
  attrOutcome: "Key outcome",
  attrSystems: "Connected systems",
  quoteLabel: "Example question",
};
