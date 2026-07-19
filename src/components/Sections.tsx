import { HistorySection } from "@/components/sections/history/HistorySection.tsx";
import { ShortenUrlSection } from "@/components/sections/shorten-url/ShortenUrlSection.tsx";
import { UploadFileSection } from "@/components/sections/upload-file/UploadFileSection.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function Sections() {
  return (
    <Tabs defaultValue="files" className="mt-4 flex w-full flex-col items-center">
      <TabsList className="w-full max-w-md">
        <TabsTrigger value="files">Files</TabsTrigger>
        <TabsTrigger value="url" className="hidden">
          URL
        </TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
      </TabsList>
      <TabsContent value="files" className="w-full max-w-md">
        <UploadFileSection />
      </TabsContent>
      <TabsContent value="url" className="w-full max-w-md">
        <ShortenUrlSection />
      </TabsContent>
      <TabsContent value="history" className="w-full max-w-4xl">
        <HistorySection />
      </TabsContent>
    </Tabs>
  );
}
