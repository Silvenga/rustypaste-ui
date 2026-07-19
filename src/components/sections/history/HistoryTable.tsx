import {
  type CellContext,
  type Column,
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type HeaderContext,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { type PropsWithChildren, useMemo, useState } from "react";
import { CgSearch } from "react-icons/cg";
import {
  HiOutlineArrowLongDown,
  HiOutlineArrowLongUp,
  HiOutlineArrowsUpDown,
} from "react-icons/hi2";
import { twMerge } from "tailwind-merge";
import type { ListItem } from "@/api/getList.ts";
import { ActionsCell } from "@/components/sections/history/cells/ActionsCell.tsx";
import { ExpiresAtCell } from "@/components/sections/history/cells/ExpiresAtCell.tsx";
import { FileNameCell } from "@/components/sections/history/cells/FileNameCell.tsx";
import { FileSizeCell } from "@/components/sections/history/cells/FileSizeCell.tsx";
import { ButtonGroup } from "@/components/ui/button-group.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";

type HistoryTableProps = {
  data: ListItem[];
  isLoading?: boolean;
};

export function HistoryTable({ data, isLoading }: HistoryTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");

  const filteredData = useMemo<ListItem[]>(() => {
    return data.filter((item) => {
      return item.fileName.toLowerCase().includes(search.toLowerCase());
    });
  }, [data, search]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    getRowId: (originalRow) => originalRow.fileName,
  });

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <ButtonGroup>
          <Input
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value.trim())}
          />
          <Button variant="outline" aria-label="Search">
            <CgSearch />
          </Button>
        </ButtonGroup>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {isLoading ? "Loading..." : "No results."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

const columns: ColumnDef<ListItem>[] = [
  {
    accessorKey: "fileName",
    enableSorting: true,
    header: (props) => <SortableHeader {...props}>Name</SortableHeader>,
    cell: (props: CellContext<ListItem, string>) => <FileNameCell {...props} />,
  },
  {
    accessorKey: "fileSize",
    enableSorting: true,
    header: (props) => <SortableHeader {...props}>Size</SortableHeader>,
    cell: (props: CellContext<ListItem, number | null>) => <FileSizeCell {...props} />,
  },
  {
    accessorKey: "expiresAtUtc",
    enableSorting: true,
    header: (props) => <SortableHeader {...props}>Expires At</SortableHeader>,
    cell: (props: CellContext<ListItem, Date | null>) => {
      const value = props.getValue();
      return <ExpiresAtCell value={value} />;
    },
  },
  {
    id: "actions",
    accessorKey: "",
    enableSorting: true,
    header: "",
    cell: (props: CellContext<ListItem, unknown>) => <ActionsCell {...props} />,
  },
];

function SortableHeader<TData, TValue = unknown>({
  column,
  children,
}: PropsWithChildren<HeaderContext<TData, TValue>>) {
  return (
    <div className="flex items-center gap-2">
      {children}
      <Button
        className="p-0"
        size="icon"
        variant="ghost"
        onClick={() => column.toggleSorting(getNextSortingState(column))}
      >
        <SortingIcon column={column} />
      </Button>
    </div>
  );
}

function getNextSortingState<TData, TValue>(column: Column<TData, TValue>) {
  switch (column.getIsSorted()) {
    case false:
      return false;
    case "asc":
      return true;
    case "desc":
      return undefined;
  }
}

function SortingIcon<TData, TValue>({
  column,
  className,
}: {
  column: Column<TData, TValue>;
  className?: string;
}) {
  switch (column.getIsSorted()) {
    case "asc":
      return <HiOutlineArrowLongUp className={twMerge(className)} />;
    case "desc":
      return <HiOutlineArrowLongDown className={twMerge(className)} />;
    default:
      return <HiOutlineArrowsUpDown className={twMerge("opacity-30", className)} />;
  }
}
