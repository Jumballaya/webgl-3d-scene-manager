import { ResizablePanel } from '@/shadcn/ui/resizable';
import EntityDetails from './EntityDetails';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shadcn/ui/tabs';
import { Separator } from '@/shadcn/ui/separator';

export default function RightSidebar() {
  return (
    <ResizablePanel minSize={12} maxSize={26} defaultSize={18}>
      <Tabs defaultValue="viewer" style={{ height: '100%' }}>
        <div className="flex items-center px-4 py-2">
          <TabsList className="ml-auto">
            <TabsTrigger
              value="viewer"
              className="text-zinc-600 dark:text-zinc-200"
            >
              Entity Details
            </TabsTrigger>
            <TabsTrigger
              value="editor"
              className="text-zinc-600 dark:text-zinc-200"
            >
              Engine Options
            </TabsTrigger>
          </TabsList>
        </div>
        <Separator />
        <TabsContent value="viewer" className="m-0 h-full">
          <div className="w-100 h-100 flex flex-col items-center justify-center my-6">
            <EntityDetails />
          </div>
        </TabsContent>
        <TabsContent value="editor" className="m-0 h-full">
          <div className="flex items-center justify-center h-full">
            <h3>Engine Details</h3>
          </div>
        </TabsContent>
      </Tabs>
    </ResizablePanel>
  );
}
