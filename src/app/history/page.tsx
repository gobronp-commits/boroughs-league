import Link from "next/link";
import { getChampions, getTitleCounts } from "@/lib/league";
import { managerColor } from "@/lib/colors";
import Crest from "@/components/Crest";

const label = "text-xs font-bold uppercase tracking-wider text-[var(--ink)]/50";

function Ring({ color }: { color: string }) {
  return (
    <span
      className="inline-block h-3.5 w-3.5 rounded-full border-[3px]"
      style={{ borderColor: color }}
      aria-hidden
    />
  );
}

export default function HistoryPage() {
  const champions = getChampions();
  const titleCounts = getTitleCounts();
  const mostTitles = titleCounts[0]?.titles ?? 0;

  return (
    <main className="min-h-dvh flex justify-center px-4 py-6 sm:py-12">
      <div className="w-full max-w-md md:max-w-4xl self-start border-2 border-[var(--ink)] bg-[var(--paper)] shadow-[6px_6px_0_var(--ink)]">
        <header className="bg-[var(--maroon)] text-[var(--paper)] p-5 sm:p-6">
          <Link
            href="/"
            className="text-xs font-bold uppercase tracking-wider text-[var(--gold)] hover:underline"
          >
            ← League Desk
          </Link>
          <div className="flex items-end justify-between gap-4 mt-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[var(--gold)]">
                The Trophy Wall · {champions.length} seasons
              </div>
              <h1 className="font-heading font-bold uppercase text-4xl sm:text-5xl leading-none mt-2">
                {titleCounts.length} names on the trophy.
              </h1>
            </div>
            <Crest className="hidden sm:block h-16 w-14 shrink-0" />
          </div>
        </header>

        <div className="grid grid-cols-5 md:grid-cols-10">
          {champions.map((c) => {
            const color = managerColor(c.manager);
            return (
              <div
                key={c.year}
                className="aspect-square flex flex-col justify-between p-2 border-b border-r border-[var(--paper)]/25"
                style={{ backgroundColor: color.bg, color: color.text }}
              >
                <span className="text-[10px] font-bold opacity-70">{c.year}</span>
                <span className="text-xs sm:text-sm font-bold leading-tight truncate">
                  {c.manager}
                </span>
              </div>
            );
          })}
        </div>

        <div className="p-5 sm:p-6">
          <div className={`${label} mb-4`}>Rings per manager</div>
          <ol className="grid gap-x-10 gap-y-3 md:grid-cols-2">
            {titleCounts.map((t) => {
              const color = managerColor(t.manager);
              const years = champions.filter((c) => c.manager === t.manager).map((c) => c.year);
              return (
                <li key={t.manager} className="flex items-center gap-3">
                  <span
                    className="h-8 w-1.5 shrink-0"
                    style={{ backgroundColor: color.bg }}
                    aria-hidden
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold">
                        {t.manager}
                        {t.titles === mostTitles && (
                          <span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-[var(--brick)]">
                            Most
                          </span>
                        )}
                      </span>
                      <span className="flex gap-1" title={`${t.titles} titles`}>
                        {Array.from({ length: t.titles }, (_, i) => (
                          <Ring key={i} color="var(--gold)" />
                        ))}
                      </span>
                    </div>
                    <div className="text-xs text-[var(--ink)]/50 truncate">
                      {years.map((y) => `'${String(y).slice(2)}`).join(" · ")}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </main>
  );
}
