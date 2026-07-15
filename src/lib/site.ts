/** Canonical, production URL of the site — single source of truth. */
export const siteUrl = "https://www.radicas.ai";

/** Scheduler link for "Book a demo". Overridable via NEXT_PUBLIC_BOOKING_URL. */
export const bookingUrl =
  process.env.NEXT_PUBLIC_BOOKING_URL || "https://cal.com/ffiore-radicas/radicas-demo";
