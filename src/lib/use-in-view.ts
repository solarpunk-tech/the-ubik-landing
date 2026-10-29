import { useEffect, useRef, useState } from "react";

/** True once the element has been on screen (or while it is, with `once: false`). */
export function useInView<T extends Element>({ threshold = 0.35, once = true } = {}) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        if (once) observer.disconnect();
      } else if (!once) {
        setInView(false);
      }
    }, { threshold });
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);
  return { ref, inView };
}
