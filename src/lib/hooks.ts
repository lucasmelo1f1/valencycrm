"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// ─── Count-Up Animation ─────────────────────────────────────

export function useCountUp(end: number, duration = 1200, delay = 0) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number>();

  useEffect(() => {
    const timeout = setTimeout(() => {
      const startTime = performance.now();

      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(eased * end));

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(animate);
        }
      };

      rafRef.current = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [end, duration, delay]);

  return count;
}

export function useAnimatedValue(end: number, duration = 1200, delay = 0, decimals = 1) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>();

  useEffect(() => {
    const timeout = setTimeout(() => {
      const startTime = performance.now();

      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const factor = Math.pow(10, decimals);
        setValue(Math.round(eased * end * factor) / factor);

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(animate);
        }
      };

      rafRef.current = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [end, duration, delay, decimals]);

  return value;
}

// ─── Spotlight Cursor Tracking ──────────────────────────────

export function useSpotlight() {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ref.current.style.setProperty("--mouse-x", `${x}px`);
    ref.current.style.setProperty("--mouse-y", `${y}px`);
  }, []);

  return { ref, handleMouseMove };
}

// ─── Scroll-Aware Header ────────────────────────────────────

export function useScrollHeader(selector = "main") {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const container = document.querySelector(selector);
    if (!container) return;

    const handleScroll = () => {
      setScrolled(container.scrollTop > 20);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [selector]);

  return scrolled;
}
