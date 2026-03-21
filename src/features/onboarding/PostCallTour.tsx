"use client";

import { useEffect, useRef, useCallback } from "react";
import {
  POST_CALL_TOUR_STEPS,
  POST_CALL_TOUR_STORAGE_KEY,
  TOUR_STORAGE_KEY,
} from "./tour-config";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type IntroJsTour = any;

export function PostCallTour() {
  const tourRef = useRef<IntroJsTour | null>(null);
  const waitingRef = useRef(false);

  const startTour = useCallback(async () => {
    // Only show once ever
    if (localStorage.getItem(POST_CALL_TOUR_STORAGE_KEY) === "true") return;

    // Welcome tour must be completed first
    if (localStorage.getItem(TOUR_STORAGE_KEY) !== "true") return;

    // Don't start if another Intro.js tour is active
    if (document.querySelector(".introjs-overlay")) return;

    const [{ default: introJs }] = await Promise.all([
      import("intro.js"),
      // @ts-expect-error -- CSS module has no type declarations
      import("intro.js/introjs.css"),
    ]);

    const tour = introJs.tour();

    tour.setOptions({
      steps: POST_CALL_TOUR_STEPS.map((step, i) => ({
        element: step.element ?? undefined,
        title: step.title,
        intro: step.intro,
        position: step.position ?? "floating",
        step: i,
        scrollTo: "tooltip" as const,
      })),
      showProgress: true,
      showBullets: false,
      exitOnOverlayClick: true,
      dontShowAgain: false,
      tooltipClass: "feltsense-tour-tooltip",
      highlightClass: "feltsense-tour-highlight",
      nextLabel: "Next &rarr;",
      prevLabel: "&larr; Back",
      doneLabel: "Got it!",
      stepNumbersOfLabel: "of",
      scrollToElement: true,
      scrollPadding: 80,
    });

    tour.onComplete(() => {
      localStorage.setItem(POST_CALL_TOUR_STORAGE_KEY, "true");
    });

    tour.onExit(() => {
      localStorage.setItem(POST_CALL_TOUR_STORAGE_KEY, "true");
    });

    tourRef.current = tour;
    tour.start();
  }, []);

  useEffect(() => {
    const handleCallEnded = () => {
      if (waitingRef.current) return;
      if (localStorage.getItem(POST_CALL_TOUR_STORAGE_KEY) === "true") return;

      waitingRef.current = true;
      let resolved = false;

      const resolve = () => {
        if (resolved) return;
        resolved = true;
        waitingRef.current = false;
        window.removeEventListener("feltsense:call-data-ready", onDataReady);
        clearTimeout(timeoutId);
        startTour();
      };

      const onDataReady = () => resolve();
      window.addEventListener("feltsense:call-data-ready", onDataReady);

      // Fallback: start tour after 8s even if data hasn't arrived
      const timeoutId = setTimeout(() => resolve(), 8000);
    };

    window.addEventListener("feltsense:call-ended", handleCallEnded);
    return () => {
      window.removeEventListener("feltsense:call-ended", handleCallEnded);
      if (tourRef.current?.isActive()) {
        tourRef.current.exit(true);
      }
    };
  }, [startTour]);

  return null;
}
