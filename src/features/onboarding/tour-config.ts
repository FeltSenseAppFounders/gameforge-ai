/**
 * Intro.js guided tour configuration for the GameForge demo dashboard.
 *
 * Steps reference elements via `data-tour` attributes or CSS selectors.
 * The tour auto-starts when `?tour=true` is in the URL.
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
    title: "WELCOME TO GAMEFORGE AI",
    intro:
      "This is your game creation studio. MAX is your AI game designer — describe a game and he'll build it live. Let's look around.",
  },
  {
    element: 'a[href="/dashboard/create"]',
    title: "CREATE A GAME",
    intro:
      "Chat with MAX here. Describe any game — a platformer, a racer, a puzzle — and watch it come to life in real-time.",
    position: "right",
  },
  {
    element: 'a[href="/dashboard/games"]',
    title: "MY GAMES",
    intro:
      "All your created games live here. Play, edit, or share them with the community.",
    position: "right",
  },
  {
    element: 'a[href="/dashboard/community"]',
    title: "COMMUNITY",
    intro:
      "Browse games created by other users. Play, like, and get inspired for your next creation.",
    position: "right",
  },
];

export const TOUR_STORAGE_KEY = "gameforge_tour_completed";
