"use client";

import { useState, useEffect, useRef } from "react";

/**
 * Cycles through an array of messages on an interval.
 * Resets to index 0 whenever `active` becomes true.
 */
export function useRotatingMessage(
  messages: string[],
  intervalMs = 3500,
  active = true
): string {
  const [index, setIndex] = useState(0);
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  // Reset index when activation changes
  useEffect(() => {
    if (active) setIndex(0);
  }, [active]);

  useEffect(() => {
    if (!active || messagesRef.current.length <= 1) return;

    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % messagesRef.current.length);
    }, intervalMs);

    return () => clearInterval(id);
  }, [active, intervalMs]);

  return messages[index % messages.length] ?? messages[0];
}
