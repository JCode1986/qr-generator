import { Container } from "@/components/layout/container";
import { LazyFaqAccordion } from "@/components/marketing/lazy-faq-accordion";
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
    question: "What will QuickQR Pro unlock?",
    answer:
      "QuickQR Pro is planned to include high-resolution PNG exports, logo-enabled exports, SVG with logo, and premium presets.",
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
      className="quickqr-defer-section scroll-mt-[calc(var(--header-height)+1rem)] py-14 sm:py-20"
    >
      <Container>
        <div className="min-w-0 w-full">
          <Badge variant="muted">FAQ</Badge>
          <h2 className="mt-4 max-w-full break-words text-3xl font-semibold text-[var(--foreground)] sm:text-4xl">
            Clear answers for static QR codes.
          </h2>
        </div>
        <LazyFaqAccordion faqs={faqs} />
      </Container>
    </section>
  );
}
