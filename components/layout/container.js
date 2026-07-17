import { classNames } from "@/lib/class-names";

export function Container({ as: Component = "div", className, children }) {
  return (
    <Component
      className={classNames(
        "mx-auto w-full max-w-[var(--container)] px-4 sm:px-5 md:px-6 lg:px-8 2xl:px-12",
        className,
      )}
    >
      {children}
    </Component>
  );
}
