import { HistoryTable } from "@/components/sections/history/HistoryTable.tsx";
import { useList } from "@/components/sections/history/useList.ts";

export function HistorySection() {
  const { list, isLoading } = useList();

  return (
    <div className="mt-4 flex flex-col gap-4">
      <HistoryTable data={list} isLoading={isLoading} />
    </div>
  );
}
