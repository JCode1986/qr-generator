"use client";

import { Accordion } from "@heroui/react/accordion";

export function FaqAccordion({ faqs }) {
  return (
    <Accordion className="mt-8 grid gap-3" hideSeparator>
      {faqs.map((faq) => (
        <Accordion.Item
          key={faq.question}
          id={faq.question}
          className="group min-w-0 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] transition duration-[var(--transition-fast)] hover:border-[color-mix(in_srgb,var(--accent)_35%,var(--border))] hover:bg-[var(--surface-elevated)]"
        >
          <Accordion.Heading level={3}>
            <Accordion.Trigger className="flex w-full cursor-pointer items-center justify-between gap-4 rounded-[var(--radius-md)] p-5 text-left text-base font-semibold text-[var(--foreground)] outline-none transition duration-[var(--transition-fast)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--accent)]">
              <span className="min-w-0 break-words">{faq.question}</span>
              <Accordion.Indicator
                className="size-5 shrink-0 text-[var(--accent)] transition-transform duration-[var(--transition-fast)] data-[expanded=true]:rotate-180"
                aria-hidden="true"
              />
            </Accordion.Trigger>
          </Accordion.Heading>
          <Accordion.Panel>
            <Accordion.Body className="px-5 pb-5 text-sm leading-6 text-[var(--muted)]">
              <p className="min-h-0 overflow-hidden break-words pt-0">
                {faq.answer}
              </p>
            </Accordion.Body>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
