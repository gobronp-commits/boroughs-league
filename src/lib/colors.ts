// A fixed maroon/gold/brick palette cycled across managers so each name
// reads consistently wherever it appears (trophy wall, standings, etc).
const PALETTE: { bg: string; text: string }[] = [
  { bg: "var(--maroon)", text: "var(--paper)" },
  { bg: "var(--gold)", text: "var(--ink)" },
  { bg: "var(--brick)", text: "var(--paper)" },
  { bg: "#8a6f1f", text: "var(--paper)" },
  { bg: "#7a2f3e", text: "var(--paper)" },
  { bg: "#e0c25a", text: "var(--ink)" },
  { bg: "#c96a52", text: "var(--ink)" },
  { bg: "#3d1420", text: "var(--paper)" },
];

export function managerColor(manager: string, managers: string[]) {
  const index = managers.indexOf(manager);
  return PALETTE[index >= 0 ? index % PALETTE.length : 0];
}
