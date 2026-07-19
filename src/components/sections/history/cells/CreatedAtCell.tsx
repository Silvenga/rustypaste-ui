import { format, formatDistanceToNow } from "date-fns";
import { LuCalendarCheck2 } from "react-icons/lu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip.tsx";

export function CreatedAtCell({ value }: { value: Date | null }) {
  return value ? (
    <Tooltip>
      <TooltipTrigger className="flex items-center gap-2">
        <LuCalendarCheck2 />
        <span>{formatDistanceToNow(value, { addSuffix: true })}</span>
      </TooltipTrigger>
      <TooltipContent>{format(value, "Pp (O)")}</TooltipContent>
    </Tooltip>
  ) : (
    "Unknown"
  );
}
