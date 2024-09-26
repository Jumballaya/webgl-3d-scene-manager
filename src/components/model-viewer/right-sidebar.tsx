import { ResizablePanel } from '@/shadcn/ui/resizable';
import EntityDetails from './entity-details/EntityDetails';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shadcn/ui/tabs';
import { Separator } from '@/shadcn/ui/separator';
import { EngineDetails } from './engine-details/EngineDetails';
import { useEditorStore } from '@/store/editorStore';
import MaterialDetails from './entity-details/MaterialDetails';
import { ScrollArea } from '@/shadcn/ui/scroll-area';

export default function RightSidebar() {
  const { rightSide } = useEditorStore();
  const tabName =
    rightSide === 'entity-details' ? 'Entity Details' : 'Material Details';

  const Details =
    rightSide === 'entity-details' ? EntityDetails : MaterialDetails;

  return (
    <ResizablePanel
      minSize={12}
      maxSize={26}
      defaultSize={18}
      className="h-full"
    >
      <Tabs defaultValue="viewer" className="h-full">
        <div className="flex px-4 py-2">
          <TabsList className="ml-auto">
            <TabsTrigger
              value="viewer"
              className="text-zinc-600 dark:text-zinc-200"
            >
              {tabName}
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
        <ScrollArea className="w-full" style={{ height: '89.5%' }}>
          <TabsContent value="viewer" className="m-0">
            <div className="w-100 flex flex-col items-center justify-center">
              <Details />
            </div>
          </TabsContent>
          <TabsContent value="editor" className="m-0">
            <div className="flex items-center">
              <EngineDetails />
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </ResizablePanel>
  );
}
