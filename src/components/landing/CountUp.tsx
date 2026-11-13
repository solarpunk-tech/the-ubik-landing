import { useEffect, useRef, useState } from "react";

const parse = (text: string) => {
  const match = text.match(/^(\D*)([\d.,]+)(.*)$/);
  return match ? { prefix: match[1], target: Number(match[2].replace(/,/g, "")), suffix: match[3], grouped: match[2].includes(",") } : null;
};

/**
 * Counts up to a figure like "100+" or "$25M+" the first time it scrolls into
 * view. Server render, reduced motion and anything that is not a plain number
 * show the final text, so nothing ever reads as zero.
 */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const parts = parse(value);
  const [shown, setShown] = useState<number | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || !parts || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const watch = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        watch.disconnect();
        const start = performance.now();
        const run = (now: number) => {
          const progress = Math.min((now - start) / 1500, 1);
          setShown(Math.round(parts.target * (1 - Math.pow(1 - progress, 3))));
          if (progress < 1) frame = requestAnimationFrame(run);
          else setShown(null);
        };
        setShown(0);
        frame = requestAnimationFrame(run);
      },
      { threshold: 0.6 }
    );
    watch.observe(node);
    return () => {
      watch.disconnect();
      cancelAnimationFrame(frame);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <span ref={ref} className={className} aria-label={value}>
      {parts && shown !== null ? `${parts.prefix}${parts.grouped ? shown.toLocaleString("en-US") : shown}${parts.suffix}` : value}
    </span>
  );
}
