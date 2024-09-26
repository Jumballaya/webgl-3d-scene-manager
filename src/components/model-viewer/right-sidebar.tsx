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
      minSize={17}
      maxSize={26}
      defaultSize={18}
      className="flex flex-col"
    >
      <ScrollArea className="w-full h-full">
        <Tabs defaultValue="details">
          <div className="flex">
            <TabsList className="mr-auto rounded-none">
              <TabsTrigger
                value="details"
                className="text-zinc-600 dark:text-zinc-200"
              >
                {tabName}
              </TabsTrigger>
              <TabsTrigger
                value="options"
                className="text-zinc-600 dark:text-zinc-200"
              >
                Engine Options
              </TabsTrigger>
            </TabsList>
          </div>
          <Separator />
          <TabsContent value="details" className="m-0">
            <Details />
          </TabsContent>
          <TabsContent value="options" className="m-0">
            <EngineDetails />
          </TabsContent>
        </Tabs>
      </ScrollArea>
    </ResizablePanel>
  );
}
