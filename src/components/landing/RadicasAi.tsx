"use client";

import { useCallback, useEffect, useMemo, useReducer, useRef, useState, type RefObject } from "react";
import { RadicasMark } from "@/components/landing/Brand";
import { SectionHead } from "@/components/landing/SectionHead";
import { useCountUp } from "@/hooks/useCountUp";
import { useInView } from "@/hooks/useInView";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useSchedule, type ScheduleStep } from "@/hooks/useSchedule";
import { useTypewriter } from "@/hooks/useTypewriter";
import { sparklinePath } from "@/lib/charts";
import { cn } from "@/lib/cn";
import { flyClone, type FlyHandle } from "@/lib/fly";
import styles from "./RadicasAi.module.css";

const QUESTION = "What did AI cost per shipped task this month, and why?";
const COST = "€2.41";
const SPARK = sparklinePath([3.12, 2.96, 2.88, 2.71, 2.55, 2.41], 200, 30);
const SWAP_MS = 480;

type Surface = {
  name: string;
  stamp: string;
  foot: string;
  placeholder: string;
  skin?: string;
};

const SURFACES: readonly Surface[] = [
  {
    name: "Radicas",
    stamp: "Answered from the data model · 0.8s",
    foot: "In Radicas",
    placeholder: "Ask about spend, work, agents…",
    skin: styles.skinRadicas,
  },
  {
    name: "Claude",
    stamp: "Used Radicas · get_kpi through MCP",
    foot: "Through MCP",
    placeholder: "Reply to Claude…",
    skin: styles.skinClaude,
  },
  {
    name: "Cursor",
    stamp: "Called MCP tool radicas.get_kpi",
    foot: "Through MCP",
    placeholder: "Ask the agent…",
    skin: styles.skinCursor,
  },
  {
    name: "Slack",
    stamp: "Rule R-212 fired · owner @Head of Eng",
    foot: "Alert · R-212",
    placeholder: "Message #eng-ai-costs…",
  },
];

type State = {
  surface: number;
  swapping: boolean;
  question: boolean;
  typing: boolean;
  stamp: boolean;
  answer: boolean;
  connected: boolean;
  step: number;
  askLive: boolean;
  viewLive: boolean;
  dropTarget: boolean;
  handing: boolean;
  costTile: boolean;
  counting: boolean;
  passLift: boolean;
  passShown: boolean;
  passFlying: boolean;
  passTile: boolean;
  passUsed: boolean;
  trend: boolean;
};

type Action =
  | { type: "start" }
  | { type: "ask" }
  | { type: "stamp" }
  | { type: "answer" }
  | { type: "swapOut" }
  | { type: "swapIn"; surface: number }
  | { type: "connect" }
  | { type: "hand" }
  | { type: "handLanded" }
  | { type: "lift" }
  | { type: "send" }
  | { type: "sendLanded" }
  | { type: "trend" };

const IDLE: State = {
  surface: 0,
  swapping: false,
  question: false,
  typing: false,
  stamp: false,
  answer: false,
  connected: false,
  step: -1,
  askLive: false,
  viewLive: false,
  dropTarget: false,
  handing: false,
  costTile: false,
  counting: false,
  passLift: false,
  passShown: false,
  passFlying: false,
  passTile: false,
  passUsed: false,
  trend: false,
};

const START: State = { ...IDLE, step: 0, askLive: true };

/** Where a full cycle ends — also what reduced motion renders outright. */
const DONE: State = {
  ...IDLE,
  question: true,
  stamp: true,
  answer: true,
  connected: true,
  step: 1,
  viewLive: true,
  costTile: true,
  passShown: true,
  passTile: true,
  passUsed: true,
  trend: true,
};

function reduce(state: State, action: Action): State {
  switch (action.type) {
    case "start":
      return START;
    case "ask":
      return { ...state, question: true, typing: true };
    case "stamp":
      return { ...state, typing: false, stamp: true };
    case "answer":
      return { ...state, answer: true };
    case "swapOut":
      return { ...state, swapping: true };
    case "swapIn":
      return { ...state, swapping: false, surface: action.surface };
    case "connect":
      return { ...state, connected: true, dropTarget: true, step: 1 };
    case "hand":
      return { ...state, askLive: false, viewLive: true, handing: true };
    case "handLanded":
      return { ...state, handing: false, dropTarget: false, costTile: true, counting: true };
    case "lift":
      return { ...state, passLift: true, dropTarget: true };
    case "send":
      return { ...state, passShown: true, passFlying: true };
    case "sendLanded":
      return { ...state, passFlying: false, dropTarget: false, passTile: true, passLift: false, passUsed: true };
    case "trend":
      return { ...state, trend: true };
  }
}

/** Registers the cycle's timers on mount; the parent remounts it to replay. */
function Timeline({ steps }: { steps: readonly ScheduleStep[] }) {
  useSchedule(steps, { run: true });
  return null;
}

function useFlight(
  active: boolean,
  from: RefObject<HTMLElement | null>,
  to: RefObject<HTMLElement | null>,
  ms: number,
  onLand: () => void,
): void {
  const handle = useRef<FlyHandle | null>(null);
  const land = useRef(onLand);

  useEffect(() => {
    land.current = onLand;
  });

  useEffect(() => {
    if (!active) return;
    const a = from.current;
    const b = to.current;
    if (!a || !b) return;
    let settled = false;
    const flight = flyClone(a, b, ms, styles.fly);
    handle.current = flight;
    void flight.finished.then(() => {
      if (!settled) land.current();
    });
    return () => {
      settled = true;
      handle.current = null;
      flight.cancel();
    };
  }, [active, from, to, ms]);
}

export function RadicasAi() {
  const reduced = useReducedMotion();
  const [machine, dispatch] = useReducer(reduce, IDLE);
  const [cycle, setCycle] = useState(0);
  const [paused, setPaused] = useState(false);
  const [finished, setFinished] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const answerRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const passPickRef = useRef<HTMLSpanElement>(null);
  const passTileRef = useRef<HTMLDivElement>(null);

  const state = reduced ? DONE : machine;
  const surface = SURFACES[state.surface];

  const play = useCallback(() => {
    dispatch({ type: "start" });
    setFinished(false);
    setCycle((c) => c + 1);
  }, []);

  const steps = useMemo<readonly ScheduleStep[]>(
    () => [
      [300, () => dispatch({ type: "ask" })],
      [2100, () => dispatch({ type: "stamp" })],
      [2800, () => dispatch({ type: "answer" })],
      [5000, () => dispatch({ type: "swapOut" })],
      [5000 + SWAP_MS, () => dispatch({ type: "swapIn", surface: 1 })],
      [10000, () => dispatch({ type: "swapOut" })],
      [10000 + SWAP_MS, () => dispatch({ type: "swapIn", surface: 2 })],
      [15000, () => dispatch({ type: "swapOut" })],
      [15000 + SWAP_MS, () => dispatch({ type: "swapIn", surface: 3 })],
      [19500, () => dispatch({ type: "connect" })],
      [20100, () => dispatch({ type: "hand" })],
      [24000, () => dispatch({ type: "trend" })],
      [26500, () => dispatch({ type: "lift" })],
      [27800, () => dispatch({ type: "send" })],
      [35000, () => setFinished(true)],
    ],
    [],
  );

  useFlight(state.handing, answerRef, ghostRef, 1300, () => dispatch({ type: "handLanded" }));
  useFlight(state.passFlying, passPickRef, passTileRef, 1000, () => dispatch({ type: "sendLanded" }));

  const inView = useInView(stageRef, { threshold: 0.3, once: true });
  useEffect(() => {
    if (inView && cycle === 0 && !reduced) play();
  }, [inView, cycle, reduced, play]);

  useEffect(() => {
    if (finished && !paused) play();
  }, [finished, paused, play]);

  const { shown } = useTypewriter(QUESTION, { speed: 20, run: state.question });
  const cost = useCountUp(COST, { run: state.counting });

  return (
    <section id="ai" className={styles.section} aria-labelledby="ai-title">
      <div className="wrap">
        <SectionHead
          kicker="Radicas AI and Vibe Metrics"
          tone="info"
          lede="Your views, your metrics and your KPIs, in an interface that adapts to you."
        >
          <span id="ai-title">
            One answer, <em>wherever you work.</em>
          </span>
        </SectionHead>

        <div
          ref={stageRef}
          className={styles.stage}
          role="img"
          aria-label="Animated: one question answered in Radicas and in your tools through MCP, then kept as a tile in a composed view"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div
            className={cn(
              styles.window,
              styles.surface,
              surface.skin,
              state.swapping && styles.swapping,
              state.surface > 0 && styles.viaMcp,
              state.askLive && styles.live,
            )}
          >
            <div className={styles.winHead}>
              <span className={styles.dots}>
                <i />
                <i />
                <i />
              </span>
              <span className={styles.avatar}>
                <RadicasMark className={styles.mark} />
                <img
                  className={cn(styles.vendor, styles.vendorClaude)}
                  src="/vendors/claude.svg"
                  alt=""
                  suppressHydrationWarning
                />
                <img
                  className={cn(styles.vendor, styles.vendorCursor)}
                  src="/vendors/cursor.svg"
                  alt=""
                  suppressHydrationWarning
                />
              </span>
              <span className={styles.surfaceName}>{surface.name}</span>
              <span className={styles.tabs}>
                {SURFACES.map((s, i) => (
                  <span key={s.name} className={cn(i === state.surface && styles.on)}>
                    {s.name}
                  </span>
                ))}
              </span>
            </div>

            <div className={styles.winBody}>
              <div className={styles.ide} aria-hidden="true">
                <div className={styles.ideTabs}>
                  <span className={styles.on}>cost_report.ts</span>
                  <span>review_agent.ts</span>
                </div>
                <div className={styles.ideLine}>
                  <b>12</b>
                  <span>
                    <span className={styles.tokK}>import</span> {"{ "}
                    <span className={styles.tokV}>radicas</span>
                    {" } "}
                    <span className={styles.tokK}>from</span> <span className={styles.tokS}>&quot;@mcp/radicas&quot;</span>
                  </span>
                </div>
                <div className={styles.ideLine}>
                  <b>13</b>
                  <span>
                    <span className={styles.tokC}>// unit cost for the sprint review</span>
                  </span>
                </div>
                <div className={styles.ideLine}>
                  <b>14</b>
                  <span>
                    <span className={styles.tokK}>const</span> <span className={styles.tokV}>kpi</span> ={" "}
                    <span className={styles.tokK}>await</span> <span className={styles.tokV}>radicas</span>.
                    <span className={styles.tokF}>getKpi</span>(<span className={styles.tokS}>&quot;cost_per_task&quot;</span>)
                  </span>
                </div>
              </div>
              <span className={styles.agentWho}>Agent</span>

              <div className={cn(styles.ask, styles.el, state.question && styles.on)}>
                <span className={styles.askWho}>You</span>
                <span className={cn(styles.askText, state.typing && styles.typing)}>
                  {state.question ? shown : ""}
                </span>
              </div>

              <div className={cn(styles.el, state.stamp && styles.on)}>
                <span className={styles.stamp}>
                  <i />
                  <span>{surface.stamp}</span>
                </span>
              </div>

              <div ref={answerRef} className={cn(styles.answer, styles.el, state.answer && styles.on)}>
                <span className="eyebrow">Cost / shipped task · September</span>
                <div className={styles.answerValue}>
                  €2.41<small>▲ 15% vs Aug</small>
                </div>
                <div className={styles.answerWhy}>
                  The Sep 9 model change made each attempt cheaper, but the review agent now rejects
                  code twice as often.
                </div>
                <div className={styles.answerBasis}>
                  <span>basis Linear · GitHub · invoice</span>
                  <span>coverage 94%</span>
                </div>
              </div>

              <div className={styles.composer}>
                <span className={styles.composerText}>{surface.placeholder}</span>
                <span className={styles.send}>
                  <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 19V5" />
                    <path d="m5 12 7-7 7 7" />
                  </svg>
                </span>
              </div>
            </div>

            <div className={styles.winFoot}>{surface.foot}</div>
          </div>

          <div className={cn(styles.link, state.connected && styles.go)}>
            <svg viewBox="0 0 104 60" preserveAspectRatio="none" aria-hidden="true">
              <path className={styles.rail} d="M4 30 H100" />
              <circle className={styles.dot} cx="4" cy="30" r="4" />
            </svg>
            <span className={styles.linkLabel}>Save as tile</span>
          </div>

          <div className={cn(styles.window, state.viewLive && styles.live)}>
            <div className={styles.winHead}>
              <span className={styles.avatar}>
                <RadicasMark className={styles.mark} />
              </span>
              Vibe metrics
              <span className={styles.tabs}>
                <span className={styles.on}>Engineering</span>
              </span>
            </div>

            <div className={styles.winBody}>
              <div className={styles.palette}>
                <span className="eyebrow">Add a KPI</span>
                <span className={cn(styles.pick, styles.used)}>Completion mode</span>
                <span className={cn(styles.pick, styles.used)}>Rework</span>
                <span
                  ref={passPickRef}
                  className={cn(styles.pick, state.passLift && styles.lift, state.passUsed && styles.used)}
                >
                  + First pass
                </span>
                <span className={styles.pick}>+ Projected</span>
              </div>

              <div className={styles.tiles}>
                <div className={styles.tile}>
                  <span className="eyebrow">Completion mode</span>
                  <div className={styles.tileValue}>85%</div>
                  <span className={styles.tileBasis}>AI 38 · AI+human 47 · human 15</span>
                </div>
                <div className={styles.tile}>
                  <span className="eyebrow">Rework</span>
                  <div className={styles.tileValue}>€211</div>
                  <span className={styles.tileBasis}>€0.46 per task · 458 tasks</span>
                </div>

                <div className={cn(styles.tile, styles.added, state.costTile && styles.on, state.trend && styles.trend)}>
                  <span className="eyebrow">
                    Cost / shipped task
                    <span className={styles.toggle}>
                      <i className={cn(!state.trend && styles.on)}>123</i>
                      <i className={cn(state.trend && styles.on)}>trend</i>
                    </span>
                  </span>
                  <div className={styles.tileValue}>{cost}</div>
                  <span className={styles.spark}>
                    <svg viewBox="0 0 200 30" preserveAspectRatio="none" aria-hidden="true">
                      <path
                        d={SPARK}
                        fill="none"
                        stroke="var(--color-brand-primary)"
                        strokeWidth="2"
                        vectorEffect="non-scaling-stroke"
                      />
                    </svg>
                  </span>
                  <span className={styles.tileBasis}>basis Linear · GitHub · invoice · coverage 94%</span>
                </div>

                <div
                  ref={passTileRef}
                  className={cn(
                    styles.tile,
                    styles.added,
                    styles.single,
                    state.passShown && styles.shown,
                    state.passTile && styles.on,
                  )}
                >
                  <span className="eyebrow">First pass</span>
                  <div className={styles.tileValue}>81%</div>
                  <span className={styles.tileBasis}>basis GitHub · reviews</span>
                </div>

                <div ref={ghostRef} className={cn(styles.tile, styles.ghost, state.dropTarget && styles.target)}>
                  Drop a KPI here
                </div>
              </div>
            </div>

            <div className={styles.winFoot}>Every tile carries its basis</div>
          </div>
        </div>

        <div className={styles.steps}>
          <div className={cn(styles.step, state.step === 0 && styles.on)}>
            <span className={styles.stepNum}>01 · ANYWHERE</span>
            <b>Ask, or be told, where you work</b>
            <p>
              Through MCP and connectors: in Radicas, Claude or Cursor, and in your team&#8217;s Slack
              channel when a rule fires.
            </p>
          </div>
          <div className={cn(styles.step, state.step === 1 && styles.on)}>
            <span className={styles.stepNum}>02 · VIBE METRICS</span>
            <b>Your views, your KPIs</b>
            <p>Save any answer as a live tile. Pick the metrics, choose how each one shows.</p>
          </div>
        </div>

        <div className={styles.play}>
          <span className="eyebrow">{paused ? "Paused on hover" : "Playing"}</span>
          <button type="button" className={styles.replay} onClick={play}>
            Replay
          </button>
        </div>
      </div>

      {cycle > 0 && !reduced && <Timeline key={cycle} steps={steps} />}
    </section>
  );
}
