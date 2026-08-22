import Link from "next/link";
import { getLeague, getChampions, getTitleCounts } from "@/lib/league";
import { managerColor } from "@/lib/colors";

export default function HistoryPage() {
  const league = getLeague();
  const champions = getChampions();
  const titleCounts = getTitleCounts();

  return (
    <div className="min-h-dvh flex flex-col items-center p-4">
      <div className="w-full max-w-md border-2 border-[var(--ink)]">
        <div className="bg-[var(--maroon)] text-[var(--paper)] p-4 sm:p-5">
          <Link
            href="/"
            className="text-xs font-bold uppercase tracking-wider text-[var(--gold)] hover:underline"
          >
            ← League Desk
          </Link>
          <div className="text-xs font-bold uppercase tracking-wider text-[var(--gold)] mt-3">
            {champions.length} seasons
          </div>
          <h1 className="font-heading font-black text-3xl leading-tight mt-1">
            {titleCounts.length} names on the trophy.
          </h1>
        </div>

        <div className="grid grid-cols-5">
          {champions.map((c) => {
            const color = managerColor(c.manager, league.managers);
            return (
              <div
                key={c.year}
                className="aspect-square flex flex-col justify-between p-2 border-b border-r border-[var(--ink)]/10"
                style={{ backgroundColor: color.bg, color: color.text }}
              >
                <span className="text-[10px] font-bold opacity-70">
                  &apos;{String(c.year).slice(2)}
                </span>
                <span className="text-xs font-bold leading-tight">{c.manager}</span>
              </div>
            );
          })}
        </div>

        <div className="p-4 sm:p-5">
          <div className="text-xs font-bold uppercase tracking-wider text-[var(--ink)]/50 mb-3">
            Rings per manager
          </div>
          <div className="space-y-2">
            {titleCounts.map((t) => (
              <div key={t.manager} className="flex items-center justify-between">
                <span className="font-bold">{t.manager}</span>
                <span className="text-[var(--ink)]/60">
                  {"● ".repeat(t.titles).trim()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
