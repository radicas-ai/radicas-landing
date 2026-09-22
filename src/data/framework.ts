// Six questions behind every answer in Radicas. Metric names only — no figures.

export interface Pillar {
  name: string;
  q: string;
  why: string;
  colour: string;
  metrics: string[];
}

export const PILLARS: Pillar[] = [
  {
    name: "Landed cost",
    q: "What does AI really cost us?",
    why:
      "AI spend hides in seats, API bills, commitments and credits spread across teams. Landed cost brings it into one figure, in one currency, that matches what you were actually billed.",
    colour: "#7571EB",
    metrics: [
      "Total AI spend, every supplier, one currency.",
      "Spend by supplier, and how it is moving.",
      "Actual spend against the approved budget.",
    ],
  },
  {
    name: "Economics",
    q: "What does a unit of work cost?",
    why:
      "A monthly bill says nothing about whether AI is worth it. Economics prices the work itself: a task, a ticket, a deal, with the failed attempts counted.",
    colour: "#4F4BC4",
    metrics: [
      "AI cost per unit of work.",
      "Cost of failed attempts and retries.",
      "How that cost splits across AI systems.",
    ],
  },
  {
    name: "Drivers",
    q: "What is driving the spend?",
    why:
      "When the number moves, someone has to explain why. Drivers traces every change to the model, system, team or project behind it.",
    colour: "#00B8CC",
    metrics: [
      "Cost by model.",
      "Cost by AI system and agent.",
      "Cost by team, cost centre or project.",
    ],
  },
  {
    name: "Governance",
    q: "Can we trust and control it?",
    why:
      "A figure nobody trusts changes nothing. Governance checks that usage matches the bill, every cost has a home and every AI system has an owner.",
    colour: "#D69520",
    metrics: [
      "Measured cost against the bill.",
      "Cost that cannot be attributed yet.",
      "AI systems with a named owner.",
    ],
  },
  {
    name: "Forecast",
    q: "What will AI cost next?",
    why:
      "Usage grows faster than budgets are set. Forecast projects the months ahead, runs what-if scenarios and prices a system before anyone builds it.",
    colour: "#E05610",
    metrics: [
      "Expected spend for the coming months.",
      "Forecast against budget.",
      "Cost of a proposed AI system, before it is built.",
    ],
  },
  {
    name: "Return",
    q: "What are we getting back?",
    why:
      "Spend only makes sense next to what it returns. Return compares AI-assisted work with the work around it: faster, better, right the first time.",
    colour: "#00A378",
    metrics: [
      "Work done right the first time.",
      "Work that comes back.",
      "Cycle time, with and without AI.",
    ],
  },
];

export const FRAMEWORK_COPY = {
  kicker: "Radicas Framework",
  headingLead: "A compass for",
  headingEmphasis: "better outcomes.",
  lede: "Six questions behind every answer in Radicas. The same six, in every function.",
  metricsLabel: "Critical metrics",
  ask: "More metrics in the full framework. Ask for it →",
};
