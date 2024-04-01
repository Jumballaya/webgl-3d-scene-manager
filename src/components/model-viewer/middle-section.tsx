import { ResizablePanel } from '@/shadcn/ui/resizable';
import { Separator } from '@/shadcn/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shadcn/ui/tabs';
import CanvasViewer from '../CanvasViewer';

export default function MiddleSection() {
  return (
    <ResizablePanel minSize={30}>
      <Tabs defaultValue="viewer">
        <div className="flex items-center px-4 py-2">
          <TabsList className="ml-auto">
            <TabsTrigger
              value="viewer"
              className="text-zinc-600 dark:text-zinc-200"
            >
              3D Viewer
            </TabsTrigger>
            <TabsTrigger
              value="editor"
              className="text-zinc-600 dark:text-zinc-200"
            >
              Script Editor
            </TabsTrigger>
          </TabsList>
        </div>
        <Separator />
        <TabsContent value="viewer" className="m-0">
          <div className="w-100 h-100 flex items-center justify-center my-6">
            <CanvasViewer />
          </div>
        </TabsContent>
        <TabsContent value="editor" className="m-0">
          Script Editor Page
        </TabsContent>
      </Tabs>
    </ResizablePanel>
  );
}
