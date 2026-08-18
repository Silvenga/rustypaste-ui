import type { CellContext } from "@tanstack/react-table";
import { MdOutlineInsertDriveFile } from "react-icons/md";
import type { ListItem } from "@/api/getList.ts";
import { Link } from "@/components/shared/Link.tsx";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip.tsx";

type FileNameCellProps = CellContext<ListItem, string>;

export function FileNameCell(props: FileNameCellProps) {
  const value = props.getValue();
  const url = props.row.original.url;
  return (
    <Tooltip>
      <TooltipTrigger className="flex items-center gap-2 min-w-0">
        <MdOutlineInsertDriveFile className="flex-shrink-0" />
        <Link
          className="truncate hover:underline focus:underline active:underline block"
          href={url}
        >
          {value}
        </Link>
      </TooltipTrigger>
      <TooltipContent>{value}</TooltipContent>
    </Tooltip>
  );
}
