import { Button } from "@/components/ui/button";

export function UtilityActions({ onUseExample, onClear, onResetDesign }) {
  return (
    <div className="flex flex-wrap gap-3">
      <Button type="button" variant="secondary" onClick={onUseExample}>
        Use example
      </Button>
      <Button type="button" variant="ghost" onClick={onClear}>
        Clear
      </Button>
      <Button type="button" variant="ghost" onClick={onResetDesign}>
        Reset design
      </Button>
    </div>
  );
}
