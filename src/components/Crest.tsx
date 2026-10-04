// Stand-in league mark until there's a real logo: a gold-outlined shield with
// the league's initial. Sized by the parent via className.
export default function Crest({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 36" className={className} aria-hidden>
      <path
        d="M16 1.5 29 6v11c0 8.2-5.6 14.6-13 17.5C8.6 31.6 3 25.2 3 17V6z"
        fill="var(--maroon)"
        stroke="var(--gold)"
        strokeWidth="2"
      />
      <text
        x="16"
        y="23.5"
        textAnchor="middle"
        fontFamily="var(--font-heading), sans-serif"
        fontWeight="700"
        fontSize="16"
        fill="var(--gold)"
      >
        B
      </text>
    </svg>
  );
}
