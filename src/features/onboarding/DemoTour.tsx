"use client";

import { useEffect, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { TOUR_STEPS, TOUR_STORAGE_KEY } from "./tour-config";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type IntroJsTour = any;

export function DemoTour() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tourRef = useRef<IntroJsTour | null>(null);
  const startedRef = useRef(false);

  const startTour = useCallback(async () => {
    const [{ default: introJs }] = await Promise.all([
      import("intro.js"),
      // @ts-expect-error -- CSS module has no type declarations
      import("intro.js/introjs.css"),
    ]);

    const tour = introJs.tour();

    tour.setOptions({
      steps: TOUR_STEPS.map((step, i) => ({
        element: step.element ?? undefined,
        title: step.title,
        intro: step.intro,
        position: step.position ?? "floating",
        step: i,
        scrollTo: "tooltip" as const,
      })),
      showProgress: true,
      showBullets: false,
      exitOnOverlayClick: false,
      dontShowAgain: false,
      tooltipClass: "gameforge-tour-tooltip",
      highlightClass: "gameforge-tour-highlight",
      nextLabel: "Next →",
      prevLabel: "← Back",
      doneLabel: "Let's go!",
      stepNumbersOfLabel: "of",
      scrollToElement: true,
      scrollPadding: 80,
    });

    tour.onComplete(() => {
      localStorage.setItem(TOUR_STORAGE_KEY, "true");
    });

    tour.onExit(() => {
      localStorage.setItem(TOUR_STORAGE_KEY, "true");
    });

    tourRef.current = tour;
    tour.start();
  }, []);

  useEffect(() => {
    const shouldStart = searchParams.get("tour") === "true";
    const alreadyCompleted = localStorage.getItem(TOUR_STORAGE_KEY) === "true";

    if (shouldStart && !alreadyCompleted && !startedRef.current) {
      startedRef.current = true;

      const url = new URL(window.location.href);
      url.searchParams.delete("tour");
      router.replace(url.pathname + url.search, { scroll: false });

      startTour();
    }

    return () => {
      if (tourRef.current?.isActive()) {
        tourRef.current.exit(true);
      }
    };
  }, [searchParams, router, startTour]);

  useEffect(() => {
    const handleReplay = () => {
      localStorage.removeItem(TOUR_STORAGE_KEY);
      startTour();
    };

    window.addEventListener("gameforge:replay-tour", handleReplay);
    return () => {
      window.removeEventListener("gameforge:replay-tour", handleReplay);
    };
  }, [startTour]);

  return null;
}
