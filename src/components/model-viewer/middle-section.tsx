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
import { Button } from '@/shadcn/ui/button';
import { PauseIcon, PlayIcon } from 'lucide-react';
import useModelViewerCore from '@/core/useModelViewerCore';
import { useState } from 'react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/shadcn/ui/tooltip';

export default function MiddleSection() {
  const { setCurrentTab, currentTab } = useEditorStore();
  const mvc = useModelViewerCore();
  const [isPlaying, setIsPlaying] = useState(mvc.isPlaying);

  return (
    <ResizablePanel minSize={30} className="">
      <Tabs value={currentTab} style={{ height: '100%' }}>
        <div className="flex items-center justify-center px-4 py-2">
          <div className="mr-auto basis-full"></div>
          <div className="basis-full flex justify-evenly">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  onClick={() => {
                    if (isPlaying) mvc.pause();
                    else mvc.play();
                    setIsPlaying(mvc.isPlaying);
                  }}
                >
                  {isPlaying ? <PauseIcon /> : <PlayIcon />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isPlaying ? 'Pause Game' : 'Play Game'}
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="basis-full flex">
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
                  if (currentTab !== 'text-editor')
                    setCurrentTab('text-editor');
                }}
              >
                Script Editor
              </TabsTrigger>
            </TabsList>
          </div>
        </div>
        <Separator />
        {
          // #TODO: Move the console footer and resizable panel group outside of the tabs content
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
