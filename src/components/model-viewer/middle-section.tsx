import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/shadcn/ui/resizable';
import { Separator } from '@/shadcn/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shadcn/ui/tabs';
import CanvasViewer from '../CanvasViewer';
import { TextEditor } from './text-editor/TextEditor';
import { useEditorStore } from '@/store/editorStore';

export default function MiddleSection() {
  const { setCurrentTab, currentTab } = useEditorStore();
  return (
    <ResizablePanel minSize={30}>
      <Tabs value={currentTab} style={{ height: '100%' }}>
        <div className="flex items-center px-4 py-2">
          <TabsList className="ml-auto">
            <TabsTrigger
              value="3d-viewer"
              className="text-zinc-600 dark:text-zinc-200"
              onClick={() => {
                if (currentTab !== '3d-viewer') setCurrentTab('3d-viewer');
              }}
            >
              3D Viewer
            </TabsTrigger>
            <TabsTrigger
              value="text-editor"
              className="text-zinc-600 dark:text-zinc-200"
              onClick={() => {
                if (currentTab !== 'text-editor') setCurrentTab('text-editor');
              }}
            >
              Script Editor
            </TabsTrigger>
          </TabsList>
        </div>
        <Separator />
        {
          // #TODO: Move the console footer abd resizable panel group outside of the tabs content
        }
        <TabsContent value="3d-viewer" className="m-0 h-full">
          <ResizablePanelGroup
            direction="vertical"
            className="items-stretch h-full"
          >
            <ResizablePanel>
              <div className="w-100 h-100 flex flex-col items-center justify-center my-6">
                <CanvasViewer />
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel maxSize={28} minSize={20}></ResizablePanel>
          </ResizablePanelGroup>
        </TabsContent>
        <TabsContent value="text-editor" className="m-0 h-full">
          <ResizablePanelGroup
            direction="vertical"
            className="items-stretch h-full"
          >
            <ResizablePanel>
              <div className="flex items-center justify-center h-full">
                <TextEditor />
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel maxSize={28} minSize={20}></ResizablePanel>
          </ResizablePanelGroup>
        </TabsContent>
      </Tabs>
    </ResizablePanel>
  );
}
