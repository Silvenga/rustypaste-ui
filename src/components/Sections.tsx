import { HistorySection } from "@/components/sections/history/HistorySection.tsx";
import { ShortenUrlSection } from "@/components/sections/shorten-url/ShortenUrlSection.tsx";
import { UploadFileSection } from "@/components/sections/upload-file/UploadFileSection.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabNames, useHashRoute } from "@/components/use-hash-route";

export function Sections() {
  const [tab, setTab] = useHashRoute();

  return (
    <Tabs value={tab} onValueChange={setTab} className="mt-4 flex w-full flex-col items-center">
      <TabsList className="w-full max-w-md">
        <TabsTrigger value={TabNames.files}>Files</TabsTrigger>
        <TabsTrigger value={TabNames.url} className="hidden">
          URL
        </TabsTrigger>
        <TabsTrigger value={TabNames.history}>History</TabsTrigger>
      </TabsList>
      <TabsContent value={TabNames.files} className="w-full max-w-md">
        <UploadFileSection />
      </TabsContent>
      <TabsContent value={TabNames.url} className="w-full max-w-md">
        <ShortenUrlSection />
      </TabsContent>
      <TabsContent value={TabNames.history} className="w-full max-w-5xl">
        <HistorySection />
      </TabsContent>
    </Tabs>
  );
}
