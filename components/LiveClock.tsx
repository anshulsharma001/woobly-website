"use client";

import { useCallback, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

type Formatters = { time: Intl.DateTimeFormat; offset: Intl.DateTimeFormat };
const cache = new Map<string, Formatters>();

function getFormatters(timeZone: string): Formatters {
  let f = cache.get(timeZone);
  if (!f) {
    f = {
      time: new Intl.DateTimeFormat("en-GB", {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
      }),
      offset: new Intl.DateTimeFormat("en-US", { timeZone, timeZoneName: "shortOffset" }),
    };
    cache.set(timeZone, f);
  }
  return f;
}

/** "GMT+5:30|20:45" — a string so React can compare snapshots by value. */
function read(timeZone: string) {
  const now = new Date();
  const f = getFormatters(timeZone);
  const offset =
    f.offset.formatToParts(now).find((p) => p.type === "timeZoneName")?.value ?? "GMT";
  return `${offset}|${f.time.format(now)}`;
}

function subscribe(onTick: () => void) {
  const id = window.setInterval(onTick, 1000);
  return () => window.clearInterval(id);
}

type LiveClockProps = { timeZone?: string; className?: string };

export function LiveClock({ timeZone = "Asia/Kolkata", className }: LiveClockProps) {
  const getSnapshot = useCallback(() => read(timeZone), [timeZone]);
  // Server snapshot is null: the time is only ever computed in the browser.
  const value = useSyncExternalStore<string | null>(subscribe, getSnapshot, () => null);
  const [offset, time] = value ? value.split("|") : ["GMT+0:00", "00:00"];

  return (
    <p className={cn("type-label flex items-center gap-3.5", className)}>
      <span className="sr-only">Local time </span>
      <span className={cn("text-ink-2", !value && "invisible")}>{offset}</span>
      <span className={cn("tabular-nums text-ink", !value && "invisible")}>{time}</span>
    </p>
  );
}
