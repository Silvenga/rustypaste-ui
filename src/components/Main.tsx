import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function Main() {
  return (
    <Tabs defaultValue="account" className="flex flex-col items-center w-md mt-4">
      <TabsList className="">
        <TabsTrigger value="account">Files</TabsTrigger>
        <TabsTrigger value="password">URL</TabsTrigger>
      </TabsList>
      <TabsContent value="account">Make changes to your account here.</TabsContent>
      <TabsContent value="password">Change your password here.</TabsContent>
    </Tabs>
  );
}
