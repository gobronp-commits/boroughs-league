"use client";

import { useSyncExternalStore } from "react";
import { daysUntil, formatDateShort } from "@/lib/league";

function subscribe() {
  return () => {};
}

export default function DraftCountdown({ draftDate }: { draftDate: string }) {
  const days = useSyncExternalStore(
    subscribe,
    () => daysUntil(draftDate),
    () => null
  );

  if (days === null) return null;

  const label = days > 0 ? "DAYS OUT" : days === 0 ? "IS TODAY" : "AGO";
  const value = Math.abs(days);

  return (
    <div className="bg-[var(--gold)] text-[var(--ink)] p-4 sm:p-5">
      <div className="text-xs font-bold uppercase tracking-wider">
        {draftDate.slice(0, 4)} Draft · {formatDateShort(draftDate)}
      </div>
      <div className="font-heading font-black text-5xl leading-none mt-1">
        {value} <span className="text-xl align-middle">{label}</span>
      </div>
      <p className="text-sm mt-2">Dave has not sent the invite. He never does.</p>
    </div>
  );
}
