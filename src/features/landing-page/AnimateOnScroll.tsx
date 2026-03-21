"use client";

import { useRef, useEffect, useState, type ReactNode } from "react";

const directionOffsets = {
  up: "translate-y-10",
  down: "-translate-y-10",
  left: "translate-x-10",
  right: "-translate-x-10",
  none: "",
} as const;

interface AnimateOnScrollProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: keyof typeof directionOffsets;
}

export function AnimateOnScroll({
  children,
  className,
  delay = 0,
  direction = "up",
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "-100px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-600 ease-out ${
        visible
          ? "opacity-100 translate-x-0 translate-y-0"
          : `opacity-0 ${directionOffsets[direction]}`
      } ${className ?? ""}`}
      style={delay > 0 ? { transitionDelay: `${delay * 1000}ms` } : undefined}
    >
      {children}
    </div>
  );
}
