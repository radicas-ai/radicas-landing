import type { FunctionData } from "@/data/functions";

export type BasisKey = "billed" | "rebuilt" | "modelled" | "count";

export type ExampleKey = "spend" | "cost" | "drivers" | "trust" | "next" | "value";

export type PillarMetric = [name: string, basis: BasisKey];

export interface Pillar {
  L: string;
  name: string;
  q: string;
  why: string;
  m: PillarMetric[];
  ex: ExampleKey;
}

export const PILLARS: Pillar[] = [
  {
    L: "L",
    name: "Landed cost",
    q: "What did AI actually cost this month?",
    why: "The billed total across every supplier, in one currency, against the budget you approved.",
    m: [
      ["Total AI spend", "billed"],
      ["Budget variance", "billed"],
      ["Spend by supplier", "billed"],
    ],
    ex: "spend",
  },
  {
    L: "E",
    name: "Economics",
    q: "What does AI cost per unit of work?",
    why: "Cost per shipped task, resolved ticket or answered query, including the attempts that failed.",
    m: [
      ["AI cost per work item", "rebuilt"],
      ["Retry cost per work item", "rebuilt"],
      ["Human and AI rounds per item", "count"],
    ],
    ex: "cost",
  },
  {
    L: "D",
    name: "Drivers",
    q: "What is driving our AI spend?",
    why: "Spend traced to the systems, models, teams and projects that caused it.",
    m: [
      ["Cost by AI system", "rebuilt"],
      ["Cost by team", "rebuilt"],
      ["Cost by model", "rebuilt"],
    ],
    ex: "drivers",
  },
  {
    L: "G",
    name: "Governance",
    q: "Can we trust, attribute and control it?",
    why: "Measured cost reconciled to the invoice, and every system with a named owner.",
    m: [
      ["Measured vs billed", "billed"],
      ["Unattributed cost", "rebuilt"],
      ["Systems with an owner", "count"],
    ],
    ex: "trust",
  },
  {
    L: "E",
    name: "Estimates",
    q: "What will AI cost next, even before we build?",
    why: "The forecast against budget, and the cost of a new system before it ships.",
    m: [
      ["Forecast vs budget", "rebuilt"],
      ["Scenario spend", "modelled"],
      ["Cost of a proposed system", "modelled"],
    ],
    ex: "next",
  },
  {
    L: "R",
    name: "Return",
    q: "What value are we getting from AI spend?",
    why: "Work that lands right first time, comes back less often and frees up people.",
    m: [
      ["First-pass rate", "count"],
      ["Rework rate", "count"],
      ["Human time saved", "count"],
    ],
    ex: "value",
  },
];

export const BASIS_LABEL: Record<BasisKey, string> = {
  billed: "Billed",
  rebuilt: "Rebuilt from usage",
  modelled: "Modelled",
  count: "Count",
};

export const FUNCTION_SHORT: string[] = ["Engineering", "Customer service", "Sales", "HR"];

const fmt = (n: number): string => Number(n).toLocaleString("en");
const plural = (n: number, a: string, b: string): string => (n === 1 ? a : b);

export const EXAMPLE: Record<ExampleKey, (f: FunctionData) => [string, string, string]> = {
  spend: (f) => [f.spend, "AI spend this month", f.spendDelta + " on last month · billed"],
  cost: (f) => [f.cost, "AI cost per " + f.unit, f.costDelta],
  drivers: (f) => [
    String(f.agents),
    "agents with spend attributed",
    "across " + f.teams + " teams · " + f.systems.slice(0, 3).join(" · "),
  ],
  trust: (f) => [
    f.coverage,
    "of AI spend attributed",
    f.unowned === 0
      ? "every system has an owner"
      : f.unowned + " " + plural(f.unowned, "system", "systems") + " without an owner",
  ],
  next: (f) => [f.budget + "%", "of the monthly budget used", f.budgetLabel],
  value: (f) => [f.fp, "right first time", fmt(f.completed) + " " + f.units + " completed · " + f.completedDelta],
};
