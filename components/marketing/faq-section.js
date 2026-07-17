import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";

const faqs = [
  {
    question: "Are static QR codes permanent?",
    answer:
      "A static QR code keeps working as long as the encoded content remains valid. QuickQR does not control whether an external link stays online.",
  },
  {
    question: "Do you store my QR content?",
    answer:
      "No QR content is intentionally saved by QuickQR. Generation happens in your browser, and uploaded logos remain local.",
  },
  {
    question: "Can I change a static QR destination later?",
    answer:
      "No. Static QR destinations are embedded into the image and cannot be edited after export.",
  },
  {
    question: "What does QuickQR Pro unlock?",
    answer:
      "Pro unlocks high-resolution PNG exports, logo-enabled exports, SVG with logo, and premium presets in this browser.",
  },
  {
    question: "Can I use the QR codes commercially?",
    answer:
      "Yes, you may use exported static QR codes commercially, but you are responsible for the content they encode.",
  },
  {
    question: "Will dynamic QR codes be added later?",
    answer:
      "Dynamic QR codes may be introduced later, but they are not part of this static MVP.",
  },
];

export function FaqSection() {
  return (
    <section
      id="faq"
      className="scroll-mt-[calc(var(--header-height)+1rem)] py-14 sm:py-20"
    >
      <Container>
        <div className="min-w-0 w-full">
          <Badge variant="muted">FAQ</Badge>
          <h2 className="mt-4 max-w-full break-words text-3xl font-semibold text-[var(--foreground)] sm:text-4xl">
            Clear answers for static QR codes.
          </h2>
        </div>
        <div className="mt-8 grid gap-3">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group min-w-0 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] transition duration-[var(--transition-fast)] hover:border-[color-mix(in_srgb,var(--accent)_35%,var(--border))] hover:bg-[var(--surface-elevated)]"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-[var(--radius-md)] p-5 text-left text-base font-semibold text-[var(--foreground)] outline-none transition duration-[var(--transition-fast)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--accent)] [&::-webkit-details-marker]:hidden">
                <span className="min-w-0 break-words">{faq.question}</span>
                <span
                  className="size-5 shrink-0 text-[var(--accent)] transition-transform duration-[var(--transition-fast)] group-open:rotate-180"
                  aria-hidden="true"
                >
                  <svg viewBox="0 0 20 20" fill="none">
                    <path
                      d="M5 7.5L10 12.5L15 7.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </summary>
              <div className="px-5 pb-5 text-sm leading-6 text-[var(--muted)]">
                <p className="min-h-0 overflow-hidden break-words pt-0">{faq.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
