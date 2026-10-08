"use client";

import { useEffect, useState } from "react";
import { formatTime, site } from "@/lib/site";

type Now = { dayIndex: number; minutes: number };

/** Current day and time at the clinic (Beirut), whatever the visitor's own timezone. */
function beirutNow(): Now {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Beirut",
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  const dayIndex = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  return { dayIndex, minutes: Number(get("hour")) * 60 + Number(get("minute")) };
}

function toMinutes(value: string): number {
  const match = value.match(/^(\d{1,2})(?::(\d{2}))? (AM|PM)$/);
  if (!match) return NaN;
  const hour = (Number(match[1]) % 12) + (match[3] === "PM" ? 12 : 0);
  return hour * 60 + Number(match[2] ?? 0);
}

export function OpeningHours() {
  // Read the clock only after hydration, so the static page never depends on build time.
  const [now, setNow] = useState<Now | null>(null);
  useEffect(() => {
    const tick = () => setNow(beirutNow());
    tick();
    const timer = window.setInterval(tick, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const today = now ? site.hours.find((day) => day.index === now.dayIndex) : undefined;
  const openNow =
    today?.open && today.close && now
      ? now.minutes >= toMinutes(today.open) && now.minutes < toMinutes(today.close)
      : false;

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-sans text-lg font-medium text-ink">Opening hours</h3>
        <p aria-live="polite" className="min-h-7 text-sm">
          {now ? (
            <span
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 ${
                openNow ? "bg-accent-soft text-accent-strong" : "bg-sand text-muted"
              }`}
            >
              <span
                aria-hidden="true"
                className={`size-2 rounded-full ${openNow ? "bg-accent-strong" : "bg-muted/60"}`}
              />
              {openNow ? "Open now" : "Closed now"}
            </span>
          ) : null}
        </p>
      </div>
      <table className="mt-4 w-full text-[0.95rem]">
        <caption className="sr-only">Opening hours, Beirut time</caption>
        <tbody>
          {site.hours.map((day) => {
            const isToday = today?.day === day.day;
            return (
              <tr
                key={day.day}
                aria-current={isToday ? "date" : undefined}
                className={`border-b border-line last:border-0 ${isToday ? "font-medium text-ink" : "text-muted"}`}
              >
                <th scope="row" className={`py-2.5 text-left ${isToday ? "font-medium" : "font-normal"}`}>
                  {day.day}
                  {isToday ? <span className="ml-2 text-xs text-accent-strong">Today</span> : null}
                </th>
                <td className="py-2.5 text-right">
                  {day.open && day.close
                    ? `${formatTime(day.open)} to ${formatTime(day.close)}`
                    : "Closed"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
