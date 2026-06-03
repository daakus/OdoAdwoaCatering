import { create } from "zustand";

export type BookingWizardStep =
  | "service"
  | "staff"
  | "date"
  | "time"
  | "details"
  | "payment"
  | "confirm";

export interface BookingWizardState {
  step: BookingWizardStep;
  serviceId: string | null;
  staffId: string | null;
  date: string | null;
  time: string | null;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  paymentMethod: string | null;
  paymentReference: string | null;
  setStep: (step: BookingWizardStep) => void;
  setService: (id: string | null) => void;
  setStaff: (id: string | null) => void;
  setDate: (date: string | null) => void;
  setTime: (time: string | null) => void;
  setCustomer: (patch: Partial<Pick<BookingWizardState, "customerName" | "customerPhone" | "customerEmail">>) => void;
  setPayment: (method: string | null, reference: string | null) => void;
  reset: () => void;
}

const initial = {
  step: "service" as BookingWizardStep,
  serviceId: null as string | null,
  staffId: null as string | null,
  date: null as string | null,
  time: null as string | null,
  customerName: "",
  customerPhone: "",
  customerEmail: "",
  paymentMethod: null as string | null,
  paymentReference: null as string | null,
};

export const useBookingWizard = create<BookingWizardState>((set) => ({
  ...initial,
  setStep: (step) => set({ step }),
  setService: (serviceId) => set({ serviceId }),
  setStaff: (staffId) => set({ staffId }),
  setDate: (date) => set({ date }),
  setTime: (time) => set({ time }),
  setCustomer: (patch) => set(patch),
  setPayment: (paymentMethod, paymentReference) =>
    set({ paymentMethod, paymentReference }),
  reset: () => set(initial),
}));
