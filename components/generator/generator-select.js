import { Select } from "@heroui/react/select";
import { ListBox } from "@heroui/react/list-box";
import { classNames } from "@/lib/class-names";

export function GeneratorSelect({
  id,
  label,
  selectedKey,
  options,
  onSelectionChange,
  disabled = false,
}) {
  const labelId = `${id}-label`;
  const selectedOption = options.find(
    (option) => String(option.value) === String(selectedKey),
  ) || options[0];

  return (
    <div className="min-w-0">
      <span id={labelId} className="text-sm font-semibold text-[var(--foreground)]">
        {label}
      </span>
      <Select
        aria-labelledby={labelId}
        selectedKey={String(selectedKey)}
        onSelectionChange={(key) => {
          if (key !== null) {
            onSelectionChange(String(key));
          }
        }}
        isDisabled={disabled}
        className="mt-2 w-full min-w-0"
      >
        <Select.Trigger
          id={id}
          className={classNames(
            "flex min-h-11 w-full min-w-0 items-center justify-between gap-2 overflow-hidden rounded-[var(--radius-sm)] border border-[color-mix(in_srgb,var(--border)_82%,white_6%)] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--surface-elevated)_92%,white_5%),var(--surface-elevated))] px-3 text-left text-sm font-semibold text-[var(--foreground)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none",
            "transition duration-[var(--transition-fast)] hover:border-[color-mix(in_srgb,var(--accent)_45%,var(--border))] hover:bg-[var(--surface-hover)]",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--accent)]",
            "data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-70",
          )}
        >
          <span className="truncate">{selectedOption.label}</span>
          <Select.Indicator className="size-4 shrink-0 text-[var(--accent)] transition-transform duration-[var(--transition-fast)] data-[open=true]:rotate-180" />
        </Select.Trigger>
        <Select.Popover className="quickqr-select-popover z-50 min-w-56 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-elevated)] p-1 text-[var(--foreground)] shadow-[var(--shadow-soft)]">
          <ListBox className="max-h-64 overflow-auto outline-none">
            {options.map((option) => (
              <ListBox.Item
                key={option.value}
                id={String(option.value)}
                textValue={option.label}
                className="flex min-h-11 cursor-pointer items-center gap-2 rounded-[var(--radius-sm)] px-3 py-2 text-sm font-semibold outline-none transition duration-[var(--transition-fast)] data-[focused=true]:bg-[var(--surface-hover)] data-[hovered=true]:bg-[var(--surface-hover)] data-[selected=true]:text-[var(--accent)]"
              >
                <span className="truncate">{option.label}</span>
                <ListBox.ItemIndicator className="ml-auto size-4 text-[var(--accent)]" />
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>
    </div>
  );
}
