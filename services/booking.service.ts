import type { Appointment, Service } from "@/types";

export async function listActiveServices(): Promise<Service[]> {
  return [];
}

export async function getAppointmentById(_id: string): Promise<Appointment | null> {
  return null;
}
