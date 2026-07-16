const trustPoints = [
  "No account required",
  "Generated in your browser",
  "PNG and SVG exports",
  "Free basic experience",
];

export function TrustPoints() {
  return (
    <ul className="grid gap-3 text-sm leading-6 text-[var(--muted)] sm:grid-cols-3 lg:grid-cols-1">
      {trustPoints.map((point) => (
        <li key={point} className="flex items-start gap-3">
          <svg
            className="mt-1 h-4 w-4 shrink-0 text-[var(--accent)]"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.25 4.75L6.75 11.25L3.5 8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>{point}</span>
        </li>
      ))}
    </ul>
  );
}
