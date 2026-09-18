// Illustrative figures only. The four answers stay the same for every function; the unit of work changes.

export type FunctionId = "eng" | "cs" | "sales" | "hr";

export type CompletionMode = "ai" | "mix" | "human";

export interface ModeMeta {
  key: CompletionMode;
  label: string;
  color: string;
}

export interface MixShare {
  ai: number;
  mix: number;
  human: number;
}

export type ModeSplit = [ai: number, mix: number, human: number];

export type Recommendation = [action: string, effect: string];

export type Counter = [value: string, label: string];

export interface FunctionData {
  id: FunctionId;
  name: string;
  unit: string;
  units: string;
  unitLabel: string;
  q: string;
  spend: string;
  spendDelta: string;
  spendTrend: number[];
  cost: string;
  costDelta: string;
  costBase: string;
  costByMonth: number[];
  efficiency: number;
  agents: number;
  teams: number;
  governed: number[];
  mix: MixShare;
  byMonth: ModeSplit[];
  completed: number;
  completedDelta: string;
  weekly: number[];
  fp: string;
  coverage: string;
  unowned: number;
  budget: number;
  budgetLabel: string;
  systems: string[];
  more: number;
  answer: string;
  recs: Recommendation[];
  saving: string;
  counters: Counter[];
}

export const MODES: ModeMeta[] = [
  { key: "ai", label: "AI", color: "var(--mode-ai)" },
  { key: "mix", label: "AI + human", color: "var(--mode-mix)" },
  { key: "human", label: "Human", color: "var(--mode-human)" },
];

export const MONTHS: string[] = ["Apr", "May", "Jun", "Jul", "Aug", "Sep"];

export const FUNCTIONS: FunctionData[] = [
  {
    id: "eng",
    name: "Engineering & Product",
    unit: "task",
    units: "tasks",
    unitLabel: "Linear task · PR",
    q: "What did AI cost per shipped task this month?",
    spend: "€1,104",
    spendDelta: "+12%",
    spendTrend: [620, 700, 760, 820, 930, 990, 1040, 1104],
    cost: "€2.41",
    costDelta: "▼ €0.38 vs baseline",
    costBase: "€2.79",
    costByMonth: [3.12, 2.96, 2.88, 2.71, 2.55, 2.41],
    efficiency: 86,
    agents: 23,
    teams: 6,
    governed: [1, 1, 1, 1, 1, 0],
    mix: { ai: 38, mix: 47, human: 15 },
    byMonth: [
      [30, 50, 20],
      [32, 49, 19],
      [34, 48, 18],
      [35, 48, 17],
      [37, 47, 16],
      [38, 47, 15],
    ],
    completed: 458,
    completedDelta: "+18% vs last month",
    weekly: [72, 81, 77, 90, 94, 104, 110, 118],
    fp: "81%",
    coverage: "94%",
    unowned: 2,
    budget: 72,
    budgetLabel: "€1,104 of €1,530",
    systems: ["Linear", "GitHub", "Claude Code", "OpenRouter", "Anthropic", "Okta"],
    more: 9,
    answer:
      "I plotted cost per shipped task for the last 6 months. It fell 23% while the AI-only share rose to 38%. Save this as a report?",
    recs: [
      ["Route docs-only PRs to a smaller review model", "−€0.31 / task"],
      ["Cap review-agent retries at 3 per run", "−€96 / month"],
      ["Assign an owner to 2 unregistered agents", "coverage +3 pts"],
      ["Reuse cached context for planner runs", "−€0.12 / task"],
    ],
    saving: "€142",
    counters: [
      ["€1,104", "AI spend attributed"],
      ["458", "tasks completed"],
      ["94%", "spend coverage"],
      ["€2.41", "per shipped task"],
    ],
  },
  {
    id: "cs",
    name: "Customer service",
    unit: "ticket",
    units: "tickets",
    unitLabel: "ticket · case",
    q: "What does an AI-resolved ticket cost, and does it stay resolved?",
    spend: "€3,371",
    spendDelta: "+9%",
    spendTrend: [2400, 2550, 2700, 2820, 2990, 3120, 3260, 3371],
    cost: "€0.86",
    costDelta: "▼ €0.22 vs baseline",
    costBase: "€1.08",
    costByMonth: [1.21, 1.12, 1.04, 0.97, 0.91, 0.86],
    efficiency: 79,
    agents: 11,
    teams: 4,
    governed: [1, 1, 1, 1, 0, 0],
    mix: { ai: 54, mix: 31, human: 15 },
    byMonth: [
      [41, 37, 22],
      [44, 36, 20],
      [47, 34, 19],
      [50, 33, 17],
      [52, 32, 16],
      [54, 31, 15],
    ],
    completed: 3920,
    completedDelta: "+11% vs last month",
    weekly: [800, 820, 870, 860, 910, 950, 970, 990],
    fp: "88%",
    coverage: "91%",
    unowned: 1,
    budget: 64,
    budgetLabel: "€3,371 of €5,260",
    systems: ["Zendesk", "ServiceNow", "Intercom", "OpenAI", "LiteLLM", "Entra ID"],
    more: 7,
    answer:
      "Cost per resolved ticket is down 29% since April. Billing disputes are reopened three times as often when AI answers first.",
    recs: [
      ["Hand billing disputes to a person after the first AI reply", "−38 reopened / month"],
      ["Switch triage to a smaller model", "−€0.07 / ticket"],
      ["Stop AI replies on tickets tagged legal", "risk reduction"],
      ["Merge duplicate QA sampler runs", "−€61 / month"],
    ],
    saving: "€310",
    counters: [
      ["€3,371", "AI spend attributed"],
      ["3,920", "tickets resolved"],
      ["88%", "stay resolved"],
      ["€0.86", "per resolved ticket"],
    ],
  },
  {
    id: "sales",
    name: "Sales",
    unit: "stage move",
    units: "stage moves",
    unitLabel: "opportunity · call",
    q: "Which AI-assisted steps actually move deals forward?",
    spend: "€3,640",
    spendDelta: "+21%",
    spendTrend: [1900, 2200, 2400, 2650, 2900, 3150, 3400, 3640],
    cost: "€6.90",
    costDelta: "▼ €1.10 vs baseline",
    costBase: "€8.00",
    costByMonth: [8.4, 8.0, 7.7, 7.4, 7.1, 6.9],
    efficiency: 71,
    agents: 9,
    teams: 3,
    governed: [1, 1, 1, 0, 0, 0],
    mix: { ai: 22, mix: 61, human: 17 },
    byMonth: [
      [15, 58, 27],
      [17, 59, 24],
      [18, 60, 22],
      [20, 60, 20],
      [21, 61, 18],
      [22, 61, 17],
    ],
    completed: 527,
    completedDelta: "+7% vs last month",
    weekly: [110, 118, 122, 119, 128, 131, 134, 138],
    fp: "34%",
    coverage: "87%",
    unowned: 3,
    budget: 81,
    budgetLabel: "€3,640 of €4,500",
    systems: ["Salesforce", "HubSpot", "Gong", "Anthropic", "Bedrock", "Okta"],
    more: 6,
    answer:
      "AI-drafted call summaries precede 61% of stage moves. Automated follow-ups on deals idle for 21+ days show no measurable progress.",
    recs: [
      ["Stop AI follow-ups on opportunities idle for 21+ days", "−€420 / month"],
      ["Keep call summaries on the current model", "no change"],
      ["Assign owners to 3 research agents", "coverage +5 pts"],
      ["Batch account research overnight", "−€0.40 / move"],
    ],
    saving: "€520",
    counters: [
      ["€3,640", "AI spend attributed"],
      ["527", "stage moves"],
      ["61%", "AI-assisted"],
      ["€6.90", "per stage move"],
    ],
  },
  {
    id: "hr",
    name: "HR",
    unit: "query",
    units: "queries",
    unitLabel: "requisition · employee query",
    q: "What does it cost to resolve an employee query with AI?",
    spend: "€961",
    spendDelta: "+4%",
    spendTrend: [780, 800, 830, 860, 880, 910, 940, 961],
    cost: "€0.54",
    costDelta: "▼ €0.09 vs baseline",
    costBase: "€0.63",
    costByMonth: [0.66, 0.63, 0.6, 0.58, 0.56, 0.54],
    efficiency: 90,
    agents: 5,
    teams: 2,
    governed: [1, 1, 1, 1, 1, 1],
    mix: { ai: 61, mix: 27, human: 12 },
    byMonth: [
      [52, 31, 17],
      [54, 30, 16],
      [56, 29, 15],
      [58, 28, 14],
      [60, 27, 13],
      [61, 27, 12],
    ],
    completed: 1780,
    completedDelta: "+5% vs last month",
    weekly: [380, 395, 400, 410, 420, 430, 436, 445],
    fp: "92%",
    coverage: "96%",
    unowned: 0,
    budget: 58,
    budgetLabel: "€961 of €1,650",
    systems: ["Workday", "Greenhouse", "Slack", "Azure OpenAI", "Portkey", "Entra ID"],
    more: 5,
    answer:
      "Cost per resolved query is down 18% since April. Payroll questions account for most hand-offs to a person.",
    recs: [
      ["Keep payroll questions on the human queue", "−64 hand-offs / month"],
      ["Refresh the policy index weekly, not daily", "−€38 / month"],
      ["Route onboarding FAQs to a smaller model", "−€0.05 / query"],
      ["Set a monthly cap on the recruiting screener", "cap at €300"],
    ],
    saving: "€96",
    counters: [
      ["€961", "AI spend attributed"],
      ["1,780", "queries resolved"],
      ["92%", "resolved first time"],
      ["€0.54", "per resolved query"],
    ],
  },
];

export interface FunctionStyle {
  word: string;
  unit: string;
  c: string;
  bg: string;
  line: string;
}

export const FUNCTION_STYLE: Record<FunctionId, FunctionStyle> = {
  eng: {
    word: "Engineering",
    unit: "shipped task",
    c: "#7571EB",
    bg: "rgba(117,113,235,.12)",
    line: "rgba(117,113,235,.35)",
  },
  cs: {
    word: "Customer service",
    unit: "resolved ticket",
    c: "#00B8CC",
    bg: "rgba(0,184,204,.11)",
    line: "rgba(0,184,204,.35)",
  },
  sales: {
    word: "Sales",
    unit: "advanced deal",
    c: "#4F4BC4",
    bg: "rgba(79,75,196,.11)",
    line: "rgba(79,75,196,.35)",
  },
  hr: {
    word: "HR",
    unit: "answered query",
    c: "#232A40",
    bg: "rgba(35,42,64,.08)",
    line: "rgba(35,42,64,.3)",
  },
};
