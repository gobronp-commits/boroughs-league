"use client";

import { useSyncExternalStore } from "react";
import { daysUntil, formatDateShort, nflWeek } from "@/lib/league";

const REGULAR_SEASON_WEEKS = 18;

function subscribe() {
  return () => {};
}

type Banner = { kicker: string; value: string; unit: string; note: string };

// Before the draft this is a countdown; after it, it tracks the NFL week so
// the top of the page never shows a stale "26 days ago".
function bannerFor(draftDate: string): Banner {
  const year = draftDate.slice(0, 4);
  const days = daysUntil(draftDate);
  if (days > 0) {
    return {
      kicker: `${year} Draft · ${formatDateShort(draftDate)}`,
      value: String(days),
      unit: days === 1 ? "day out" : "days out",
      note: "Dave has not sent the invite. He never does.",
    };
  }
  if (days === 0) {
    return {
      kicker: `${year} Draft`,
      value: "Today",
      unit: "",
      note: "Phones charged. Rankings printed.",
    };
  }
  const week = nflWeek(draftDate);
  if (week === 0) {
    return {
      kicker: `${year} Season · Drafted ${formatDateShort(draftDate)}`,
      value: "Kickoff",
      unit: "Thursday",
      note: "Rosters are set. Every team is undefeated for a few more days.",
    };
  }
  if (week > REGULAR_SEASON_WEEKS) {
    return {
      kicker: `${year} Season`,
      value: "Final",
      unit: "",
      note: "The regular season is in the books. See you at the next draft.",
    };
  }
  return {
    kicker: `${year} Season · Drafted ${formatDateShort(draftDate)}`,
    value: `Week ${week}`,
    unit: `of ${REGULAR_SEASON_WEEKS}`,
    note: "Set your lineup before Thursday kickoff.",
  };
}

export default function DraftCountdown({ draftDate }: { draftDate: string }) {
  const banner = useSyncExternalStore(
    subscribe,
    () => JSON.stringify(bannerFor(draftDate)),
    () => null
  );

  if (banner === null) {
    // Reserve the banner's height during SSR so the page doesn't jump.
    return <div className="bg-[var(--gold)] h-[9.5rem]" aria-hidden />;
  }

  const { kicker, value, unit, note } = JSON.parse(banner) as Banner;

  return (
    <div className="bg-[var(--gold)] text-[var(--ink)] p-5 sm:p-6">
      <div className="text-xs font-bold uppercase tracking-wider">{kicker}</div>
      <div className="font-heading font-bold uppercase text-5xl leading-none mt-2">
        {value} {unit && <span className="text-xl align-middle opacity-70">{unit}</span>}
      </div>
      <p className="text-sm mt-3">{note}</p>
    </div>
  );
}
