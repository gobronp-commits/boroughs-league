import Link from "next/link";
import {
  getLeague,
  getChampions,
  getAllTimeStandings,
  getTitlesLeaders,
  getDefendingChampion,
  winPct,
} from "@/lib/league";
import { managerColor } from "@/lib/colors";
import DraftCountdown from "@/components/DraftCountdown";
import Crest from "@/components/Crest";

function formatPct(pct: number): string {
  return pct.toFixed(3).replace(/^0\./, ".");
}

const label = "text-xs font-bold uppercase tracking-wider text-[var(--ink)]/50";

export default function Home() {
  const league = getLeague();
  const champions = getChampions();
  const standings = getAllTimeStandings(5);
  const titleLeaders = getTitlesLeaders();
  const defending = getDefendingChampion();
  const recentChampions = champions.slice(-5).reverse();

  return (
    <main className="min-h-dvh flex justify-center px-4 py-6 sm:py-12">
      <div className="w-full max-w-md md:max-w-4xl self-start border-2 border-[var(--ink)] bg-[var(--paper)] shadow-[6px_6px_0_var(--ink)]">
        <header className="bg-[var(--ink)] text-[var(--paper)] p-5 sm:p-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--gold)]">
            <Crest className="h-6 w-6" />
            <span>{league.name}</span>
          </div>
          <div className="flex justify-between items-end mt-3">
            <h1 className="font-heading font-bold uppercase text-4xl sm:text-5xl leading-none">
              League Desk
            </h1>
            <div className="text-right text-xs font-bold uppercase tracking-wider text-[var(--paper)]/60">
              <div>Est. {league.established}</div>
              <div>{champions.length} seasons</div>
            </div>
          </div>
        </header>

        <div className="md:grid md:grid-cols-2">
          <div className="md:border-r border-[var(--ink)]/20">
            <DraftCountdown draftDate={league.draftDate} />

            <div className="grid grid-cols-2 border-b border-[var(--ink)]/20">
              <div className="p-5 border-r border-[var(--ink)]/20">
                <div className={label}>Titles lead</div>
                <div className="font-heading font-bold text-xl mt-1">
                  {titleLeaders.map((l) => l.manager).join(" & ")}
                </div>
                <div className="text-sm text-[var(--ink)]/60">
                  {titleLeaders[0]?.titles} rings{titleLeaders.length > 1 && " each"}
                </div>
              </div>
              <div className="p-5">
                <div className={label}>Defending</div>
                <div className="font-heading font-bold text-xl mt-1">{defending?.manager}</div>
                <div className="text-sm text-[var(--ink)]/60">{defending?.year} champion</div>
              </div>
            </div>

            <div className="p-5 border-b md:border-b-0 border-[var(--ink)]/20">
              <div className={`${label} mb-3`}>Last five champions</div>
              <div className="grid grid-cols-5 gap-1.5">
                {recentChampions.map((c) => {
                  const color = managerColor(c.manager);
                  return (
                    <div
                      key={c.year}
                      className="aspect-square flex flex-col justify-between p-1.5"
                      style={{ backgroundColor: color.bg, color: color.text }}
                    >
                      <span className="text-[10px] font-bold opacity-70">
                        &apos;{String(c.year).slice(2)}
                      </span>
                      <span className="text-xs font-bold leading-tight truncate">{c.manager}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <div className={`flex justify-between ${label} mb-4`}>
              <span>All-time top {standings.length}</span>
              <span>W–L · Pct</span>
            </div>
            <ol className="space-y-4">
              {standings.map((row, i) => {
                const pct = winPct(row.wins, row.losses);
                return (
                  <li key={row.manager} className="flex items-center gap-3">
                    <span
                      className={`font-heading font-bold text-lg w-6 ${
                        i === 0 ? "text-[var(--gold)]" : "text-[var(--ink)]/30"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="font-bold truncate">{row.manager}</span>
                        <span className="font-bold tabular-nums">
                          {row.wins}–{row.losses}
                          <span className="ml-2 text-sm font-normal text-[var(--ink)]/50">
                            {formatPct(pct)}
                          </span>
                        </span>
                      </div>
                      <div className="mt-1.5 h-1.5 bg-[var(--ink)]/10">
                        <div
                          className="h-full bg-[var(--maroon)]"
                          style={{ width: `${pct * 100}%` }}
                        />
                      </div>
                      <div className="mt-1 text-xs text-[var(--ink)]/50">
                        {row.seasons} {row.seasons === 1 ? "season" : "seasons"}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>

        <Link
          href="/history"
          className="block text-center bg-[var(--maroon)] text-[var(--paper)] text-sm font-bold uppercase tracking-wider py-4 hover:bg-[var(--brick)] transition-colors"
        >
          See the trophy wall →
        </Link>
      </div>
    </main>
  );
}
