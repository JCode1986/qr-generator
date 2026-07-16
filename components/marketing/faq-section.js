import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

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
    <section id="faq" className="py-14 sm:py-20">
      <Container>
        <div className="max-w-2xl">
          <Badge variant="muted">FAQ</Badge>
          <h2 className="mt-4 text-3xl font-semibold text-[var(--foreground)] sm:text-4xl">
            Clear answers for static QR codes.
          </h2>
        </div>
        <div className="mt-8 grid gap-3">
          {faqs.map((faq) => (
            <Card key={faq.question} variant="default" padding="none">
              <details className="group">
                <summary className="cursor-pointer list-none p-5 text-base font-semibold text-[var(--foreground)]">
                  {faq.question}
                </summary>
                <p className="px-5 pb-5 text-sm leading-6 text-[var(--muted)]">
                  {faq.answer}
                </p>
              </details>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
