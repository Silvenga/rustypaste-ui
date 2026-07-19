import type { CellContext } from "@tanstack/react-table";
import { MdOutlineInsertDriveFile } from "react-icons/md";
import type { ListItem } from "@/api/getList.ts";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip.tsx";

type FileNameCellProps = CellContext<ListItem, string>;

export function FileNameCell(props: FileNameCellProps) {
  const value = props.getValue();
  const url = props.row.original.url;
  return (
    <Tooltip>
      <TooltipTrigger className="flex items-center gap-2">
        <MdOutlineInsertDriveFile />
        <a
          className="max-w-72 truncate hover:underline focus:underline active:underline"
          href={url}
          target="_blank"
          rel="noreferrer noopener"
        >
          {value}
        </a>
      </TooltipTrigger>
      <TooltipContent>{value}</TooltipContent>
    </Tooltip>
  );
}
