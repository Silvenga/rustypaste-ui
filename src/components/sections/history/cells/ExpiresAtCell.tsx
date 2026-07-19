import { format, formatDistanceToNow } from "date-fns";
import { LuCalendarClock } from "react-icons/lu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip.tsx";

export function ExpiresAtCell({ value }: { value: Date | null }) {
  return value ? (
    <Tooltip>
      <TooltipTrigger className="flex items-center gap-2">
        <LuCalendarClock />
        <span>in {formatDistanceToNow(value)}</span>
      </TooltipTrigger>
      <TooltipContent>{format(value, "Pp (O)")}</TooltipContent>
    </Tooltip>
  ) : (
    "Never"
  );
}
