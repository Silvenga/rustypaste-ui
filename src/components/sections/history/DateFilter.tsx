import { useCallback } from "react";
import { LuCalendarCheck2 } from "react-icons/lu";
import { twMerge } from "tailwind-merge";
import { ButtonGroup, ButtonGroupText } from "@/components/ui/button-group.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip.tsx";

export type DateFilterValue = "hour" | "day" | "week" | null;

const FILTERS = [
  { value: "hour", label: "Past Hour" },
  { value: "day", label: "Past Day" },
  { value: "week", label: "Past Week" },
] as const;

type DateFilterProps = {
  value: DateFilterValue;
  onChange: (next: DateFilterValue) => void;
};

export function DateFilter({ value, onChange }: DateFilterProps) {
  const toggle = useCallback(
    (next: Exclude<DateFilterValue, null>) => {
      onChange(value === next ? null : next);
    },
    [onChange, value],
  );

  return (
    <ButtonGroup>
      <Tooltip>
        <TooltipTrigger asChild>
          <ButtonGroupText aria-hidden className={twMerge("bg-background")}>
            <LuCalendarCheck2 />
          </ButtonGroupText>
        </TooltipTrigger>
        <TooltipContent>Created At</TooltipContent>
      </Tooltip>
      {FILTERS.map((filter) => {
        const selected = value === filter.value;
        return (
          <Button
            key={filter.value}
            variant={selected ? "default" : "secondary"}
            size="sm"
            onClick={() => toggle(filter.value)}
            className={twMerge("h-full border", !selected && "bg-background text-primary")}
          >
            {filter.label}
          </Button>
        );
      })}
    </ButtonGroup>
  );
}
