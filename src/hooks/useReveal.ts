import { useEffect, useRef } from "react";

type RevealOptions = {
  threshold?: number;
  rootMargin?: string;
};

export function useReveal({ threshold = 0.12, rootMargin = "0px 0px -40px 0px" }: RevealOptions = {}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      ref.current?.querySelectorAll<HTMLElement>(".reveal,.reveal-left,.reveal-right,.reveal-scale")
        .forEach(el => el.classList.add("visible"));
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            el.style.willChange = "transform, opacity";
            el.classList.add("visible");
            observer.unobserve(el);
            const onEnd = () => {
              el.style.willChange = "auto";
              el.removeEventListener("transitionend", onEnd);
            };
            el.addEventListener("transitionend", onEnd, { once: true });
          }
        });
      },
      { threshold, rootMargin }
    );

    const container = ref.current;
    if (!container) return;

    container.querySelectorAll<HTMLElement>(".reveal,.reveal-left,.reveal-right,.reveal-scale")
      .forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return ref;
}
