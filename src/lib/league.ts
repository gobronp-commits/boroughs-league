import raw from "../../data/league.json";

export type League = {
  name: string;
  established: number;
  commissioner: string;
  pprSince: number;
  currentSeason: number;
  draftDate: string;
  managers: string[];
};

export type Champion = {
  year: number;
  manager: string;
};

export type StandingRow = {
  rank: number;
  manager: string;
  wins: number;
  losses: number;
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
  champions: Champion[];
  allTimeStandings: StandingRow[];
  records: {
    highestWeekEver: HighestWeek;
  };
};

const data = raw as LeagueData;

export function getLeague(): League {
  return data.league;
}

export function getChampions(): Champion[] {
  return data.champions;
}

export function getAllTimeStandings(): StandingRow[] {
  return data.allTimeStandings;
}

export function getHighestWeekEver(): HighestWeek {
  return data.records.highestWeekEver;
}

export function winPct(wins: number, losses: number): number {
  const total = wins + losses;
  return total === 0 ? 0 : wins / total;
}

export type TitleCount = { manager: string; titles: number };

export function getTitleCounts(): TitleCount[] {
  const counts = new Map<string, number>();
  for (const c of data.champions) {
    counts.set(c.manager, (counts.get(c.manager) ?? 0) + 1);
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
  return [...data.champions].sort((a, b) => b.year - a.year)[0];
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
