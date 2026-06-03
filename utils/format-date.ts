import { format, parseISO } from "date-fns";

export function formatAppointmentDate(iso: string, pattern = "PPpp") {
  return format(parseISO(iso), pattern);
}
