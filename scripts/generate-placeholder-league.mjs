// Generates data/league.json: placeholder history in the *right shape* for a
// league whose roster size and membership actually change over time (some
// years 10 teams, some 12; managers join and leave). All these names are
// invented placeholders - swap in the real Yahoo export and this script
// becomes unnecessary.
import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

const FIRST_YEAR = 2006;
const LAST_YEAR = 2025;

// Known managers who've won a title, with the season range they were in the
// league (inclusive) - wide enough to cover their championship year(s).
const KNOWN = [
  { name: "Dave", from: 2006, to: 2025 },
  { name: "Tony", from: 2006, to: 2013 },
  { name: "Marcus", from: 2006, to: 2019 },
  { name: "Ken", from: 2009, to: 2017 },
  { name: "Priya", from: 2011, to: 2025 },
  { name: "Rachel", from: 2013, to: 2025 },
  { name: "Nate", from: 2018, to: 2023 },
  { name: "Bri", from: 2020, to: 2025 },
];

const CHAMPIONS = {
  2006: "Dave",
  2007: "Tony",
  2008: "Marcus",
  2009: "Dave",
  2010: "Tony",
  2011: "Marcus",
  2012: "Ken",
  2013: "Priya",
  2014: "Dave",
  2015: "Rachel",
  2016: "Ken",
  2017: "Priya",
  2018: "Priya",
  2019: "Marcus",
  2020: "Nate",
  2021: "Dave",
  2022: "Rachel",
  2023: "Bri",
  2024: "Priya",
  2025: "Rachel",
};

// Filler managers who round out the roster each year. A rotating window
// (offset by year) is drawn from this pool so membership actually turns
// over year to year instead of being a fixed extra group.
const FILLER_POOL = [
  "Alex",
  "Sam",
  "Jordan",
  "Casey",
  "Morgan",
  "Lee",
  "Riley",
  "Quinn",
  "Drew",
  "Taylor",
];

function teamCountForYear(year) {
  if (year <= 2012) return 10;
  if (year <= 2020) return 12;
  return 10;
}

function fillersForYear(year, needed) {
  const offset = (year - FIRST_YEAR) % FILLER_POOL.length;
  const picked = [];
  for (let i = 0; i < needed; i++) {
    picked.push(FILLER_POOL[(offset + i) % FILLER_POOL.length]);
  }
  return picked;
}

// Small deterministic hash -> pseudo-random float in [0, 1), so the same
// (year, name) always produces the same placeholder record.
function seededRandom(seedStr) {
  let h = 2166136261;
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 10000) / 10000;
}

const GAMES_PER_SEASON = 13;

function recordFor(year, manager, isChampion) {
  const r = seededRandom(`${year}:${manager}`);
  const wins = isChampion
    ? 10 + Math.floor(r * 3) // 10-12
    : 3 + Math.floor(r * 8); // 3-10
  const clampedWins = Math.min(wins, GAMES_PER_SEASON);
  return { wins: clampedWins, losses: GAMES_PER_SEASON - clampedWins };
}

const seasons = [];
for (let year = FIRST_YEAR; year <= LAST_YEAR; year++) {
  const teamCount = teamCountForYear(year);
  const champion = CHAMPIONS[year];
  const known = KNOWN.filter((m) => year >= m.from && year <= m.to).map((m) => m.name);
  const needed = teamCount - known.length;
  const roster = [...known, ...fillersForYear(year, Math.max(needed, 0))];

  const standings = roster
    .map((manager) => ({ manager, ...recordFor(year, manager, manager === champion) }))
    .sort((a, b) => b.wins - a.wins || a.manager.localeCompare(b.manager));

  seasons.push({ year, teamCount, champion, standings });
}

const league = {
  name: "The Borough's League",
  established: FIRST_YEAR,
  commissioner: "Dave",
  pprSince: 2009,
  currentSeason: 2026,
  draftDate: "2026-09-08",
};

const records = {
  highestWeekEver: {
    manager: "Bri",
    score: 205.3,
    season: 2023,
    week: 6,
    note: "Broke Priya's eight-year-old mark by 3.7 and then missed the playoffs by one game.",
  },
};

writeFileSync(
  path.join(root, "data", "league.json"),
  JSON.stringify({ league, seasons, records }, null, 2) + "\n"
);

console.log(`wrote ${seasons.length} seasons to data/league.json`);
for (const s of seasons) {
  console.log(`  ${s.year}: ${s.teamCount} teams, champion ${s.champion}`);
}
