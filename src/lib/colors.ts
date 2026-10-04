import { getTitleCounts } from "./league";

// A fixed maroon/gold/brick palette, kept visually distinct from neighbors so
// adjacent squares on the trophy wall never read as the same manager.
const PALETTE: { bg: string; text: string }[] = [
  { bg: "var(--maroon)", text: "var(--paper)" },
  { bg: "var(--gold)", text: "var(--ink)" },
  { bg: "var(--brick)", text: "var(--paper)" },
  { bg: "var(--ink)", text: "var(--gold)" },
  { bg: "#e8d48b", text: "var(--ink)" },
  { bg: "#4a5a3a", text: "var(--paper)" },
  { bg: "#c96a52", text: "var(--ink)" },
  { bg: "#8a6f1f", text: "var(--paper)" },
];

function hashString(value: string): number {
  let h = 0;
  for (let i = 0; i < value.length; i++) {
    h = (h * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

// Champions get palette slots in order of titles won, so the first eight
// title-holders are guaranteed distinct colors. Anyone beyond that (or who
// has never won) falls back to a hash, which keeps their color stable
// without needing a pre-built roster list (the roster changes year to year).
export function managerColor(manager: string) {
  const rank = getTitleCounts().findIndex((t) => t.manager === manager);
  const index = rank >= 0 && rank < PALETTE.length ? rank : hashString(manager);
  return PALETTE[index % PALETTE.length];
}
