import raw from "../../data/league.json";

export type League = {
  name: string;
  established: number;
  commissioner: string;
  pprSince: number;
  currentSeason: number;
  draftDate: string;
};

export type SeasonStanding = {
  manager: string;
  wins: number;
  losses: number;
};

export type Season = {
  year: number;
  teamCount: number;
  champion: string;
  standings: SeasonStanding[];
};

export type HighestWeek = {
  manager: string;
  score: number;
  season: number;
  week: number;
  note: string;
};

export type LeagueData = {
  league: League;
  seasons: Season[];
  records: {
    highestWeekEver: HighestWeek;
  };
};

const data = raw as LeagueData;

export function getLeague(): League {
  return data.league;
}

export function getSeasons(): Season[] {
  return data.seasons;
}

export function getSeason(year: number): Season | undefined {
  return data.seasons.find((s) => s.year === year);
}

export function getHighestWeekEver(): HighestWeek {
  return data.records.highestWeekEver;
}

export type Champion = { year: number; manager: string };

export function getChampions(): Champion[] {
  return data.seasons.map((s) => ({ year: s.year, manager: s.champion }));
}

// Every manager who has ever fielded a team, in first-appearance order.
export function getAllManagers(): string[] {
  const seen = new Set<string>();
  for (const season of data.seasons) {
    for (const row of season.standings) seen.add(row.manager);
  }
  return [...seen];
}

export function winPct(wins: number, losses: number): number {
  const total = wins + losses;
  return total === 0 ? 0 : wins / total;
}

export type AllTimeRow = {
  manager: string;
  wins: number;
  losses: number;
  seasons: number;
};

// Aggregated only across the seasons each manager actually played - not
// every manager has been in the league the whole 20 years.
export function getAllTimeStandings(limit?: number): AllTimeRow[] {
  const totals = new Map<string, { wins: number; losses: number; seasons: number }>();
  for (const season of data.seasons) {
    for (const row of season.standings) {
      const entry = totals.get(row.manager) ?? { wins: 0, losses: 0, seasons: 0 };
      entry.wins += row.wins;
      entry.losses += row.losses;
      entry.seasons += 1;
      totals.set(row.manager, entry);
    }
  }
  const rows = [...totals.entries()]
    .map(([manager, t]) => ({ manager, ...t }))
    .sort((a, b) => winPct(b.wins, b.losses) - winPct(a.wins, a.losses) || b.wins - a.wins);
  return limit ? rows.slice(0, limit) : rows;
}

export type TitleCount = { manager: string; titles: number };

export function getTitleCounts(): TitleCount[] {
  const counts = new Map<string, number>();
  for (const s of data.seasons) {
    counts.set(s.champion, (counts.get(s.champion) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([manager, titles]) => ({ manager, titles }))
    .sort((a, b) => b.titles - a.titles);
}

export function getTitlesLeaders(): TitleCount[] {
  const counts = getTitleCounts();
  const max = counts[0]?.titles ?? 0;
  return counts.filter((c) => c.titles === max);
}

export function getDefendingChampion(): Champion | undefined {
  const latest = [...data.seasons].sort((a, b) => b.year - a.year)[0];
  return latest ? { year: latest.year, manager: latest.champion } : undefined;
}

export function formatDateShort(dateIso: string): string {
  const [y, m, d] = dateIso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function daysUntil(dateIso: string, from: Date = new Date()): number {
  const [y, m, d] = dateIso.split("-").map(Number);
  const target = new Date(y, m - 1, d);
  const fromMidnight = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  return Math.round((target.getTime() - fromMidnight.getTime()) / 86_400_000);
}
