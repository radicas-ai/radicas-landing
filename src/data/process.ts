// One worked example — Engineering — carried through the four steps. Illustrative figures.

export type ProcessStepKey = "econ" | "drv" | "rec" | "gov";

export interface ProcessStep {
  k: ProcessStepKey;
  name: string;
  q: string;
}

export const PROCESS_STEPS: ProcessStep[] = [
  { k: "econ", name: "Economics", q: "What does a unit of work cost?" },
  { k: "drv", name: "Drivers", q: "What is driving the spend?" },
  { k: "rec", name: "Recommendations", q: "What should change?" },
  { k: "gov", name: "Governance", q: "Can we trust and control it?" },
];

export const PROCESS_COPY = {
  kicker: "How it works · Four steps",
  headingLead: "From questions to",
  headingEmphasis: "better decisions.",
  lede:
    "Start with the economics of the work AI actually performs, understand what drives cost and outcomes, and move from answers and explanations to recommendations and action.",
  frameTitle: "Engineering · AI cost per shipped task",
};

/** The figure in the frame header. `from` forces the tween to start somewhere other than the last value. */
export interface KpiState {
  label: string;
  to: number;
  from?: number;
}

export const PROCESS_KPI: KpiState[] = [
  { label: "Sep", to: 2.41 },
  { label: "Aug → Sep", to: 2.41, from: 2.1 },
  { label: "Expected", to: 2.04 },
  { label: "Oct 10", to: 2.05 },
];

/** Under the August baseline the figure reads as a win. */
export const KPI_GOOD_BELOW = 2.1;

export const ECONOMICS = {
  eyebrow: "01 · Economics",
  title: "What a shipped task costs in AI",
  value: "2.41",
  caption: "per shipped task · September",
  delta: "▲ 15% vs €2.10 in August",
  split: [
    { label: "First-attempt work", note: "", value: "€1.95", pct: 80.9, tone: "brand" as const },
    {
      label: "Rework",
      note: "code rejected and rewritten",
      value: "€0.46",
      pct: 19.1,
      tone: "warn" as const,
    },
  ],
  people: { value: "1.8", text: "engineer step-ins per task, up from 1.2" },
};

export const DRIVERS = {
  eyebrow: "02 · Drivers",
  title: "Why it moved",
  from: { label: "August", value: "€2.10" },
  to: { label: "September", value: "€2.41" },
  rows: [
    { label: "Cheaper implementer model", note: "since Sep 9", delta: -0.16 },
    { label: "Code fails review 2× as often", note: "more rework", delta: 0.38 },
    { label: "Planner reads more code", note: "larger context", delta: 0.09 },
  ],
  note: { lead: "One change, two effects:", rest: "−€0.16 saved, +€0.38 in rework." },
};

/** The widest bar in the drivers view; every row scales against it. */
export const DRIVER_MAX = 0.38;

export const RECOMMENDATIONS = {
  eyebrow: "03 · Recommendations",
  title: "What to change, and what it would do",
  cards: [
    {
      tag: "Optimise",
      fx: "Fixes the rework",
      body: "Keep the cheaper model for simple tasks. Send complex ones back to the previous model.",
      effect: "−€0.30 / task",
    },
    {
      tag: "Optimise",
      fx: "Fixes the planner",
      body: "Let the planner read only the files the task touches.",
      effect: "−€0.07 / task",
    },
  ],
  resultLead: "With both:",
  resultValue: "€2.04 per task",
  resultRest: ", below August.",
  cta: "Make it a rule",
};

export const GOVERNANCE = {
  eyebrow: "04 · Governance",
  title: "One rule, one owner, one record",
  ruleEyebrow: "Rule · Owner: Head of Engineering",
  rule: "More than 2 review rounds per task? Alert the owner.",
  timeline: [
    { k: "Alert", when: "Oct 3", text: "2.6 review rounds per task. Tasks attached." },
    { k: "Owner acts", when: "Oct 3", text: "Payments tasks back to the previous model." },
    { k: "On record", when: "Oct 10", text: "€2.05 per task. All logged." },
  ],
  advancedLabel: "Advanced step",
  advanced: "Radicas reroutes the task itself.",
  back: "Next month's figure is the check.",
};

/** The aside: what the visitor walks away with at each step. */
export interface ProcessGain {
  h: string;
  b: string[];
}

export const PROCESS_GAINS: ProcessGain[] = [
  { h: "The real cost of the work.", b: ["Cost per unit", "Rework, split out", "People in the loop"] },
  { h: "The reason behind the number.", b: ["What moved", "By how much", "Hidden side effects"] },
  { h: "What to change, priced.", b: ["Tied to a driver", "Saving in euros", "One click to a rule"] },
  { h: "A decision that holds.", b: ["Named owner", "Alert with evidence", "Everything on record"] },
];
