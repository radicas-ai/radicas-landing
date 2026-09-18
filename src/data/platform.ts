export type PlatformRowKey = "estate" | "map" | "receipt" | "ledger";

export interface PlatformRow {
  k: PlatformRowKey;
  name: string;
  num: string;
  desc: string;
  tags: string[];
  title: string;
  chips: string[];
  foot: string;
  does: string;
  needs: string;
}

export const PLATFORM_ROWS: PlatformRow[] = [
  {
    k: "estate",
    name: "AI estate",
    num: "01",
    desc: "Every AI system, agent, seat and invoice, in one inventory that matches the bill.",
    tags: ["connectors", "agent & key inventory", "billing reconciliation", "coverage state"],
    title: "AI estate · inventory",
    chips: ["48 entities", "91% reconciled"],
    foot: "Inventory · reconciliation · coverage",
    does:
      "Connects the vendors already in place, discovers agents and keys from telemetry, reconciles usage to the invoice and keeps a coverage state on every number: billed, estimated or unknown.",
    needs:
      "Read access to the vendors and the identity provider; invoices or an ERP export; an owner for what the telemetry cannot name.",
  },
  {
    k: "map",
    name: "Humans and AI on one map",
    num: "02",
    desc: "Who, or what, did the work, for which team, on which unit.",
    tags: ["one identity model", "teams & ownership", "units of work", "attribution rules"],
    title: "Attribution map · Engineering",
    chips: ["94% of spend on a team", "89% on a unit"],
    foot: "Identity · work · cost, joined by rules written once",
    does:
      "Joins identity, work and cost by rules written once: a person or an agent, the team it belongs to, the unit of work it touched. The same map for every function; the unit changes.",
    needs:
      "The identity provider and the agent registry; the systems where work lives (Linear, GitHub, the helpdesk, the CRM); team and ownership declared once.",
  },
  {
    k: "receipt",
    name: "Cost of a unit of work",
    num: "03",
    desc: "What a task, a ticket or a deal costs, humans and AI together, failures included.",
    tags: ["blended cost", "retry & failure cost", "completion mode", "speed & outcome"],
    title: "Receipt · LIN-482",
    chips: ["AI + human", "merged · first pass"],
    foot: "One receipt per unit · computed by rules, never estimated by hand",
    does:
      "Prices each unit of work as agent cost plus human time plus what failed along the way, and puts completion mode, speed and outcome on the same line, so value is read next to cost.",
    needs:
      "A definition of the unit per function (task, ticket, stage move, query) and a rate card for human time, declared by you.",
  },
  {
    k: "ledger",
    name: "Governance that watches and acts",
    num: "04",
    desc: "Rules with a named owner, watched and provable. Alerts today; enforcement as the advanced step.",
    tags: ["budgets & thresholds", "named owner", "watch · alert", "act · advanced", "append-only ledger"],
    title: "Rule R-212 · Review-agent retries",
    chips: ["Alert · live", "Enforce · advanced"],
    foot: "Versioned rulebook · append-only ledger",
    does:
      "Watches every rule against the model, alerts the named owner the moment it fires, and writes the event to an append-only ledger under the rule version that produced it. Executors apply caps, routing and approvals within a mandate, as the advanced step.",
    needs:
      "Budgets and thresholds per team, agent or model; an owner per rule; for the advanced step, a mandate per scope, revocable.",
  },
];

export const PLATFORM_NEEDS: Record<PlatformRowKey, string> = {
  estate: "Vendor and identity access; invoices or an ERP export; an owner for what telemetry cannot name.",
  map: "Identity provider, agent registry, the systems where work lives; team ownership declared once.",
  receipt: "The unit per function (task, ticket, deal, query) and a rate card for human time.",
  ledger: "Budgets and thresholds, an owner per rule; a revocable mandate per scope for the advanced step.",
};
