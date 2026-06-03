import { addMinutes, format, isAfter, parseISO, set } from "date-fns";

export interface AvailabilityInput {
  date: string;
  openingTime: string;
  closingTime: string;
  slotIntervalMinutes: number;
  durationMinutes: number;
  existingAppointments: Array<{ start_at: string; end_at: string }>;
  staffWindows?: Array<{ start_time: string; end_time: string }>;
}

function parseTime(date: Date, hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return set(date, { hours: h || 0, minutes: m || 0, seconds: 0, milliseconds: 0 });
}

function overlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) {
  return aStart < bEnd && bStart < aEnd;
}

export function buildAvailability(input: AvailabilityInput): string[] {
  const day = parseISO(`${input.date}T00:00:00`);
  const dayStart = parseTime(day, input.openingTime);
  const dayEnd = parseTime(day, input.closingTime);
  const now = new Date();

  const windows =
    input.staffWindows && input.staffWindows.length > 0
      ? input.staffWindows.map((w) => ({
          start: parseTime(day, w.start_time),
          end: parseTime(day, w.end_time),
        }))
      : [{ start: dayStart, end: dayEnd }];

  const taken = input.existingAppointments.map((a) => ({
    start: parseISO(a.start_at),
    end: parseISO(a.end_at),
  }));

  const out: string[] = [];
  for (const w of windows) {
    let cursor = w.start;
    while (isAfter(w.end, addMinutes(cursor, input.durationMinutes)) || +w.end === +addMinutes(cursor, input.durationMinutes)) {
      const slotStart = cursor;
      const slotEnd = addMinutes(slotStart, input.durationMinutes);
      const inPast = isAfter(now, slotStart);
      const conflict = taken.some((t) => overlaps(slotStart, slotEnd, t.start, t.end));
      if (!inPast && !conflict) {
        out.push(format(slotStart, "hh:mm a"));
      }
      cursor = addMinutes(cursor, input.slotIntervalMinutes);
    }
  }
  return Array.from(new Set(out));
}

