/**
 * The swap contract: `SWAP_MS` is how long the old content is held. CSS reads it as `var(--swap)`
 * and fades out over 70% of it, so the content is fully invisible before it is replaced.
 * Read deliberately without a fallback: a section that forgets to spread the rotator's `vars`
 * gets an invalid duration and a visibly instant swap, instead of drifting out of sync in silence.
 */
export const SWAP_MS = 320;

export const DWELL = {
  process: 9000,
  functions: 6500,
  framework: 7000,
} as const;
