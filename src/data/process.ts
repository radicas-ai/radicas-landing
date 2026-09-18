import type { FunctionId } from "@/data/functions";

export type ProcessStepKey = "ask" | "see" | "understand" | "govern" | "loop";

export interface ProcessStep {
  k: ProcessStepKey;
  name: string;
  small?: string;
  comp: string;
  desc: string;
  title?: string;
  chips: string[];
  foot: string;
}

export type RecKind = "opt" | "scale" | "stop";

export type ProcessTile = [label: string, value: string, delta: string, basis: string[]];

export type ProcessRec = [kind: RecKind, title: string, metric: string, pick?: boolean];

export type ProcessRow = [label: string, value: string];

export interface ProcessContent {
  q: string;
  unit: string;
  sugg: string[];
  tiles: ProcessTile[];
  hist: number[];
  fut: number[];
  base: number;
  rng: [number, number];
  fmt: (v: number) => string;
  why: string;
  expl: string;
  ev: string[];
  recs: ProcessRec[];
  rule: string;
  rid: string;
  /** Raw HTML fragment: consumers render it as markup. */
  when: string;
  owner: string;
  enforce: string;
  loop: ProcessRow[];
  /** Values are raw HTML fragments: consumers render them as markup. */
  re: ProcessRow[];
}

export const PROCESS_STEPS: ProcessStep[] = [
  {
    k: "ask",
    name: "Ask",
    comp: "Radicas AI · Framework",
    desc: "A plain-language question, or one the Framework already knows.",
    title: "Radicas AI",
    chips: ["In-app", "Slack", "MCP"],
    foot: "Ask · request · explain",
  },
  {
    k: "see",
    name: "See",
    comp: "Business rules · Data model → Numbers · Projections",
    desc: "Rules turn one data model into numbers. A view built from governed KPIs.",
    chips: ["Composed from 3 KPIs"],
    foot: "Numbers · projections",
  },
  {
    k: "understand",
    name: "Understand",
    comp: "Radicas AI → Explanations · Recommendations",
    desc: "Why it cost more, what broke, what to do: scale, optimise or stop.",
    title: "Explanation",
    chips: ["Confidence high", "4 signals"],
    foot: "Explanations · recommendations",
  },
  {
    k: "govern",
    name: "Govern",
    comp: "Governance rules → Alert",
    desc: "The decision becomes a rule, with a trigger and a named owner.",
    chips: ["v1"],
    foot: "Alert · named owner",
  },
  {
    k: "loop",
    name: "Loop",
    small: "and back",
    comp: "Outcomes → Assumptions & policies",
    desc: "What happened feeds the model. The next answer is better.",
    title: "Assumptions & policies",
    chips: ["Updated today"],
    foot: "The model gets better and comes back in",
  },
];

// Per-function content for the five states. Illustrative.
export const PROCESS_CONTENT: Record<FunctionId, ProcessContent> = {
  eng: {
    q: "Why did cost per shipped task rise last week, and what should we change?",
    unit: "shipped task",
    sugg: [
      "What does AI cost per shipped task?",
      "Which agents did the work?",
      "Where do retries burn budget?",
      "What will next month cost?",
    ],
    tiles: [
      ["Cost / shipped task", "€2.41", "▼ 14%", ["basis Linear · GitHub · invoice", "coverage 94%"]],
      ["Tasks shipped · 30d", "458", "+18%", ["basis Linear", "coverage 100%"]],
      ["Projected · next month", "€2.28", "/ task", ["assumptions 2 declared", "scenario base"]],
    ],
    hist: [2.79, 2.71, 2.62, 2.55, 2.49, 2.41],
    fut: [2.41, 2.36, 2.3, 2.28],
    base: 2.79,
    fmt: (v) => "€" + v.toFixed(2),
    rng: [2.1, 2.9],
    why: "Why cost per task rose 9% in week 3",
    expl:
      "Review-agent retries doubled after the model change on Sep 9: 41 failed runs burned €148 before merge. Planner and implementer costs were flat. The rise is a retry problem, not a volume problem.",
    ev: ["41 failed runs", "retries 2.1 → 4.3 / run", "model change · Sep 9", "coverage 94%"],
    recs: [
      ["opt", "Cap review-agent retries at 3 per run", "est. −€96 / month · no quality change on 30-day sample", true],
      ["scale", "Docs and test generation", "cost per task −31% · first pass 91%"],
      ["stop", "Auto-refactor on legacy repos", "0 merged in 30 days · €212 burned"],
    ],
    rule: "Review-agent retries",
    rid: "R-212 · v2",
    when: '<span class="mono">review_agent.retries_per_run</span> &gt; 3, or budget at <span class="mono">85%</span>',
    owner: "Platform lead",
    enforce:
      "At 100% of budget: cap review-agent runs and route to the smaller model — in Radicas or in your gateway",
    loop: [
      ["Retries per run", "4.3 → 2.6"],
      ["Cost / shipped task", "€2.41 → €2.19"],
      ["First pass", "81% → 83%"],
    ],
    re: [
      ["Baseline · cost / task", '<span class="old">€2.79</span>€2.41'],
      ["Policy · retry cap", "R-212 v2 · declared by Platform lead"],
      ["Assumption · review model", "updated Sep 16"],
    ],
  },
  cs: {
    q: "Why are AI-resolved billing tickets coming back, and what should we change?",
    unit: "resolved ticket",
    sugg: [
      "What does an AI-resolved ticket cost?",
      "Which tickets stay resolved?",
      "Where do escalations cost most?",
      "What will next month cost?",
    ],
    tiles: [
      ["Cost / resolved ticket", "€0.86", "▼ 20%", ["basis Zendesk · invoice", "coverage 91%"]],
      ["Tickets resolved · 30d", "3,920", "+11%", ["basis Zendesk", "coverage 100%"]],
      ["Projected · next month", "€0.82", "/ ticket", ["assumptions 3 declared", "scenario base"]],
    ],
    hist: [1.21, 1.12, 1.04, 0.97, 0.91, 0.86],
    fut: [0.86, 0.85, 0.83, 0.82],
    base: 1.08,
    fmt: (v) => "€" + v.toFixed(2),
    rng: [0.7, 1.3],
    why: "Why billing tickets are reopened 3× more often",
    expl:
      "When AI answers a billing dispute first, 34% are reopened within 7 days; the reply agent lacks invoice context. Order-status and returns are stable at 96% resolved. The problem is one ticket type, not the AI-first policy.",
    ev: ["212 escalations after AI", "billing reopen 34%", "no invoice context", "coverage 91%"],
    recs: [
      ["stop", "Hand billing disputes to a person after the first AI reply", "est. −38 reopened / month", true],
      ["scale", "Order status and returns", "96% stay resolved · €0.41 / ticket"],
      ["opt", "Triage on a smaller model", "est. −€0.07 / ticket"],
    ],
    rule: "AI-first replies · billing",
    rid: "R-118 · v1",
    when: 'reopen rate on AI-first replies &gt; <span class="mono">12%</span> for any ticket type, or budget at <span class="mono">85%</span>',
    owner: "Support ops",
    enforce: "Route the affected ticket type to a person after the first AI reply; cap reply-agent spend per type",
    loop: [
      ["Billing reopen rate", "34% → 9%"],
      ["Cost / resolved ticket", "€0.86 → €0.84"],
      ["Escalations after AI", "212 → 140"],
    ],
    re: [
      ["Baseline · reopen rate", '<span class="old">12%</span>9%'],
      ["Policy · billing routing", "R-118 v1 · declared by Support ops"],
      ["Assumption · invoice context", "flagged for the reply agent"],
    ],
  },
  sales: {
    q: "Which AI-assisted steps actually move deals forward, and which should we stop?",
    unit: "stage move",
    sugg: [
      "What does AI cost per stage move?",
      "Which steps are AI-assisted?",
      "Which follow-ups burn budget?",
      "What will next month cost?",
    ],
    tiles: [
      ["Cost / stage move", "€6.90", "▼ 14%", ["basis Salesforce · Gong · invoice", "coverage 87%"]],
      ["Stage moves · 30d", "527", "+7%", ["basis Salesforce", "coverage 100%"]],
      ["Projected · next month", "€6.60", "/ move", ["assumptions 4 declared", "scenario base"]],
    ],
    hist: [8.4, 8.0, 7.7, 7.4, 7.1, 6.9],
    fut: [6.9, 6.8, 6.7, 6.6],
    base: 8.0,
    fmt: (v) => "€" + v.toFixed(2),
    rng: [6, 9],
    why: "Why €420 a month produces no progress",
    expl:
      "AI-drafted call summaries precede 61% of stage moves. Automated follow-ups on opportunities idle for 21+ days produced no stage move in 90 days — €420 a month with no measurable effect.",
    ev: ["61% of moves after a summary", "0 moves from idle follow-ups", "€420 / month", "coverage 87%"],
    recs: [
      ["stop", "Stop AI follow-ups on opportunities idle for 21+ days", "est. −€420 / month", true],
      ["scale", "Call summaries", "precede 61% of stage moves"],
      ["opt", "Batch account research overnight", "est. −€0.40 / move"],
    ],
    rule: "Follow-ups on idle opportunities",
    rid: "R-305 · v1",
    when: 'AI follow-up on an opportunity idle &gt; <span class="mono">21 days</span>, or budget at <span class="mono">85%</span>',
    owner: "RevOps",
    enforce: "Stop automated follow-ups on idle opportunities; cap research-agent spend per account",
    loop: [
      ["Idle follow-ups", "184 → 0 / month"],
      ["Cost / stage move", "€6.90 → €6.10"],
      ["AI spend", "€3,640 → €3,220"],
    ],
    re: [
      ["Baseline · cost / move", '<span class="old">€8.00</span>€6.90'],
      ["Policy · idle cut-off", "R-305 v1 · declared by RevOps"],
      ["Assumption · follow-up value", "set to zero after 21 days"],
    ],
  },
  hr: {
    q: "Why are payroll questions handed off, and what should we change?",
    unit: "resolved query",
    sugg: [
      "What does AI cost per resolved query?",
      "Which queries need a person?",
      "Where do hand-offs cost most?",
      "Are answers consistent with policy?",
    ],
    tiles: [
      ["Cost / resolved query", "€0.54", "▼ 14%", ["basis Workday · invoice", "coverage 96%"]],
      ["Queries resolved · 30d", "1,780", "+5%", ["basis Workday · Slack", "coverage 100%"]],
      ["Projected · next month", "€0.52", "/ query", ["assumptions 1 declared", "scenario base"]],
    ],
    hist: [0.66, 0.63, 0.6, 0.58, 0.56, 0.54],
    fut: [0.54, 0.53, 0.53, 0.52],
    base: 0.63,
    fmt: (v) => "€" + v.toFixed(2),
    rng: [0.45, 0.7],
    why: "Why payroll questions account for most hand-offs",
    expl:
      "64 of 78 hand-offs last month were payroll questions; the policy assistant answers from the handbook, which does not hold individual payslip data. Leave and benefits questions are resolved first time in 92% of cases.",
    ev: ["64 payroll hand-offs", "no payslip access", "92% first time elsewhere", "coverage 96%"],
    recs: [
      ["stop", "Keep payroll questions on the human queue", "est. −64 hand-offs / month", true],
      ["scale", "Leave and benefits FAQs", "92% resolved first time"],
      ["opt", "Refresh the policy index weekly, not daily", "est. −€38 / month"],
    ],
    rule: "Payroll routing",
    rid: "R-410 · v1",
    when: 'hand-offs on payroll questions &gt; <span class="mono">40 / month</span>, or budget at <span class="mono">85%</span>',
    owner: "People ops",
    enforce:
      "Route payroll questions to a person before the first AI reply; cap the recruiting screener at €300 / month",
    loop: [
      ["Payroll hand-offs", "64 → 6 / month"],
      ["Cost / resolved query", "€0.54 → €0.51"],
      ["First time resolved", "92% → 95%"],
    ],
    re: [
      ["Baseline · first time", '<span class="old">90%</span>92%'],
      ["Policy · payroll routing", "R-410 v1 · declared by People ops"],
      ["Assumption · handbook scope", "excludes individual payslips"],
    ],
  },
};
