/** Shared Supabase select fragments for customer appointment queries. */

export const customerAppointmentSelect = `
  id,
  start_at,
  end_at,
  status,
  staff_id,
  staff (
    display_name
  ),
  appointment_services (
    service_id,
    duration_minutes,
    price_at_booking,
    services (
      id,
      name,
      slug,
      image_url
    )
  ),
  payments (
    verification_status,
    method,
    reference
  )
` as const;

export const upcomingStatuses = [
  "pending_payment",
  "payment_submitted",
  "payment_verified",
  "booking_confirmed",
] as const;
