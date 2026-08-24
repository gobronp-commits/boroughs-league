import Link from "next/link";
import {
  getLeague,
  getChampions,
  getAllTimeStandings,
  getTitlesLeaders,
  getDefendingChampion,
  winPct,
} from "@/lib/league";
import DraftCountdown from "@/components/DraftCountdown";

function formatPct(pct: number): string {
  return pct.toFixed(3).replace(/^0\./, ".");
}

export default function Home() {
  const league = getLeague();
  const champions = getChampions();
  const standings = getAllTimeStandings(5);
  const titleLeaders = getTitlesLeaders();
  const defending = getDefendingChampion();

  return (
    <div className="min-h-dvh flex flex-col items-center p-4">
      <div className="w-full max-w-md border-2 border-[var(--ink)]">
        <div className="bg-[var(--ink)] text-[var(--paper)] p-4 sm:p-5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--gold)]">
            <span className="inline-flex h-5 w-5 items-center justify-center border border-dashed border-[var(--gold)]/50 text-[8px] text-[var(--gold)]/50">
              LOGO
            </span>
            <span>The Borough&apos;s League</span>
          </div>
          <div className="flex justify-between items-end mt-2">
            <h1 className="font-heading font-black text-3xl">League Desk</h1>
            <div className="text-right text-xs font-bold uppercase tracking-wider text-[var(--paper)]/60">
              <div>Est. {league.established}</div>
              <div>{champions.length} seasons</div>
            </div>
          </div>
        </div>

        <DraftCountdown draftDate={league.draftDate} />

        <div className="grid grid-cols-2 border-b border-[var(--ink)]/20">
          <div className="p-4 border-r border-[var(--ink)]/20">
            <div className="text-xs font-bold uppercase tracking-wider text-[var(--ink)]/50">
              Titles lead
            </div>
            <div className="font-heading font-black text-lg mt-0.5">
              {titleLeaders.map((l) => l.manager).join(" & ")} · {titleLeaders[0]?.titles}
            </div>
          </div>
          <div className="p-4">
            <div className="text-xs font-bold uppercase tracking-wider text-[var(--ink)]/50">
              Defending
            </div>
            <div className="font-heading font-black text-lg mt-0.5">
              {defending?.manager} · {defending?.year}
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-[var(--ink)]/50 mb-3">
            <span>All-time top {standings.length}</span>
            <span>W-L</span>
          </div>
          <div className="space-y-3">
            {standings.map((row, i) => (
              <div key={row.manager} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-[var(--ink)]/40 w-5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-bold">{row.manager}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold">
                    {row.wins}–{row.losses}
                  </div>
                  <div className="text-xs text-[var(--ink)]/50">
                    {formatPct(winPct(row.wins, row.losses))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Link
          href="/history"
          className="block text-center bg-[var(--maroon)] text-[var(--paper)] text-sm font-bold uppercase tracking-wider py-3 hover:opacity-90 transition-opacity"
        >
          See the trophy wall →
        </Link>
      </div>
    </div>
  );
}
