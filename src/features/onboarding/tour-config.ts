/**
 * Intro.js guided tour configuration for the demo dashboard.
 *
 * Steps reference elements via `data-tour` attributes or CSS selectors.
 * The tour auto-starts when `?tour=true` is in the URL (set by /try-it-now redirect).
 */

export type TourPosition = "floating" | "top" | "bottom" | "left" | "right";

export interface TourStepConfig {
  element?: string;
  title: string;
  intro: string;
  position?: TourPosition;
}

export const TOUR_STEPS: TourStepConfig[] = [
  {
    element: '[data-tour="voice-widget"]',
    title: "Hey, talk to Sarah!",
    intro:
      "Click the button below to start a conversation with Sarah — your AI receptionist. She can check availability and book real appointments. Give it a try!",
    position: "top",
  },
];

export const TOUR_STORAGE_KEY = "feltsense_tour_completed";

export const POST_CALL_TOUR_STEPS: TourStepConfig[] = [
  {
    title: "Call complete!",
    intro:
      "Great call! Sarah handled everything. Let's show you where your data landed.",
  },
  {
    element: '[data-tour="recent-calls"]',
    title: "Your call was logged",
    intro:
      "The call appears here with a full AI summary and outcome. Click any row to see the complete transcript.",
    position: "top",
  },
  {
    element: 'a[href="/dashboard/patients"]',
    title: "Patient created",
    intro:
      "A new patient record was created from the call. You'll find all patient details and history here.",
    position: "right",
  },
  {
    element: 'a[href="/dashboard/appointments"]',
    title: "Appointment booked",
    intro:
      "If Sarah booked an appointment, it shows up here in real time. Check it out!",
    position: "right",
  },
  {
    element: 'a[href="/dashboard/booking-requests"]',
    title: "Booking requests",
    intro:
      "Any requests that need manual review land here. Sarah flags what she can't auto-schedule.",
    position: "right",
  },
];

export const POST_CALL_TOUR_STORAGE_KEY = "feltsense_postcall_tour_shown";
