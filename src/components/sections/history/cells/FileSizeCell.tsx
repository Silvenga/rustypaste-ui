import type { CellContext } from "@tanstack/react-table";
import { filesize } from "filesize";
import type { ListItem } from "@/api/getList.ts";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip.tsx";

type FileSizeCellProps = CellContext<ListItem, number | null>;

export function FileSizeCell(props: FileSizeCellProps) {
  const value = props.getValue();
  return value ? (
    <Tooltip>
      <TooltipTrigger className="max-w-56 truncate">
        {filesize(value, { round: 1, pad: true, standard: "iec" })}
      </TooltipTrigger>
      <TooltipContent>{value} bytes</TooltipContent>
    </Tooltip>
  ) : (
    "-"
  );
}
