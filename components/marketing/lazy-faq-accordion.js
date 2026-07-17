"use client";

import { useEffect, useRef, useState } from "react";

function FaqFallback({ faqs }) {
  return (
    <div className="mt-8 grid gap-3">
      {faqs.map((faq) => (
        <details
          key={faq.question}
          className="group min-w-0 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] transition duration-[var(--transition-fast)] open:bg-[var(--surface-elevated)]"
        >
          <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 rounded-[var(--radius-md)] p-5 text-left text-base font-semibold text-[var(--foreground)] outline-none transition duration-[var(--transition-fast)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--accent)] [&::-webkit-details-marker]:hidden">
            <span className="min-w-0 break-words">{faq.question}</span>
            <span
              className="size-5 shrink-0 text-center text-[var(--accent)] transition-transform duration-[var(--transition-fast)] group-open:rotate-180"
              aria-hidden="true"
            >
              v
            </span>
          </summary>
          <div className="px-5 pb-5 text-sm leading-6 text-[var(--muted)]">
            <p className="min-h-0 overflow-hidden break-words pt-0">
              {faq.answer}
            </p>
          </div>
        </details>
      ))}
    </div>
  );
}

export function LazyFaqAccordion({ faqs }) {
  const rootRef = useRef(null);
  const loadingRef = useRef(false);
  const [AccordionComponent, setAccordionComponent] = useState(null);

  useEffect(() => {
    if (AccordionComponent || loadingRef.current) {
      return undefined;
    }

    function loadAccordion() {
      if (loadingRef.current) {
        return;
      }

      loadingRef.current = true;

      import("@/components/marketing/faq-accordion")
        .then((module) => {
          setAccordionComponent(() => module.FaqAccordion);
        })
        .catch(() => {
          loadingRef.current = false;
        });
    }

    const root = rootRef.current;

    if (!root || !("IntersectionObserver" in window)) {
      const timeoutId = window.setTimeout(loadAccordion, 600);

      return () => {
        window.clearTimeout(timeoutId);
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          loadAccordion();
        }
      },
      { rootMargin: "360px 0px" },
    );

    observer.observe(root);

    return () => {
      observer.disconnect();
    };
  }, [AccordionComponent]);

  return (
    <div ref={rootRef}>
      {AccordionComponent ? (
        <AccordionComponent faqs={faqs} />
      ) : (
        <FaqFallback faqs={faqs} />
      )}
    </div>
  );
}
