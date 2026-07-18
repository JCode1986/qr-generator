import { useCallback, useRef, useState } from "react";
import { classNames } from "@/lib/class-names";

let heroUiSelectPromise;

function loadHeroUiSelect() {
  if (!heroUiSelectPromise) {
    heroUiSelectPromise = import("@/components/generator/heroui-generator-select");
  }

  return heroUiSelectPromise;
}

export function GeneratorSelect({
  id,
  label,
  selectedKey,
  options,
  onSelectionChange,
  disabled = false,
}) {
  const [HeroUiSelect, setHeroUiSelect] = useState(null);
  const loadingRef = useRef(false);

  const loadSelect = useCallback(() => {
    if (loadingRef.current || HeroUiSelect) {
      return;
    }

    loadingRef.current = true;

    loadHeroUiSelect()
      .then((module) => {
        setHeroUiSelect(() => module.HeroUiGeneratorSelect);
      })
      .catch(() => {
        loadingRef.current = false;
      });
  }, [HeroUiSelect]);

  if (HeroUiSelect) {
    return (
      <HeroUiSelect
        id={id}
        label={label}
        selectedKey={selectedKey}
        options={options}
        onSelectionChange={onSelectionChange}
        disabled={disabled}
      />
    );
  }

  const labelId = `${id}-label`;

  return (
    <div
      className="min-w-0"
      onPointerEnter={loadSelect}
      onPointerDown={loadSelect}
    >
      <label id={labelId} htmlFor={id} className="text-sm font-semibold text-[var(--foreground)]">
        {label}
      </label>
      <div className="relative mt-2">
        <select
          id={id}
          aria-labelledby={labelId}
          value={String(selectedKey)}
          onChange={(event) => onSelectionChange(event.target.value)}
          disabled={disabled}
          className={classNames(
            "min-h-11 w-full min-w-0 appearance-none rounded-[var(--radius-sm)] border border-[color-mix(in_srgb,var(--border)_82%,white_6%)] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--surface-elevated)_92%,white_5%),var(--surface-elevated))] px-3 pr-9 text-sm font-semibold text-[var(--foreground)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none",
            "transition duration-[var(--transition-fast)] hover:border-[color-mix(in_srgb,var(--accent)_45%,var(--border))] hover:bg-[var(--surface-hover)]",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--accent)]",
            "disabled:cursor-not-allowed disabled:opacity-70",
          )}
        >
          {options.map((option) => (
            <option key={option.value} value={String(option.value)}>
              {option.label}
            </option>
          ))}
        </select>
        <span
          className="pointer-events-none absolute right-3 top-1/2 size-2.5 -translate-y-1/2 rotate-45 border-b-2 border-r-2 border-[var(--accent)]"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
