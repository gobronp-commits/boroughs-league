// A fixed maroon/gold/brick palette. Managers are hashed to a palette entry
// so any name gets a consistent color everywhere without needing a
// pre-built roster list (the roster changes year to year).
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

function hashString(value: string): number {
  let h = 0;
  for (let i = 0; i < value.length; i++) {
    h = (h * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export function managerColor(manager: string) {
  return PALETTE[hashString(manager) % PALETTE.length];
}
