import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const useCases = [
  "Restaurant menus",
  "Event invitations",
  "Wi-Fi sharing",
  "Business cards",
  "Product packaging",
  "Social profiles",
];

function UseCaseIcon() {
  return (
    <svg
      className="h-5 w-5 shrink-0 text-[var(--accent)]"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 5.5C4 4.67 4.67 4 5.5 4H8V8H4V5.5ZM12 4H14.5C15.33 4 16 4.67 16 5.5V8H12V4ZM4 12H8V16H5.5C4.67 16 4 15.33 4 14.5V12ZM12 12H16V14.5C16 15.33 15.33 16 14.5 16H12V12Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="M9.5 9.5H11V11H9.5V9.5Z" fill="currentColor" />
    </svg>
  );
}

export function UseCasesSection() {
  return (
    <section
      id="use-cases"
      className="scroll-mt-[calc(var(--header-height)+1rem)] py-14 sm:py-20"
    >
      <Container>
        <div className="min-w-0 w-full">
          <Badge variant="muted">Use cases</Badge>
          <h2 className="mt-4 max-w-full break-words text-3xl font-semibold text-[var(--foreground)] sm:text-4xl">
            Useful wherever a static code is enough.
          </h2>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {useCases.map((useCase) => (
            <Card key={useCase} variant="default" className="flex min-w-0 items-center gap-3">
              <UseCaseIcon />
              <h3 className="min-w-0 max-w-full break-words text-base font-semibold text-[var(--foreground)]">
                {useCase}
              </h3>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
