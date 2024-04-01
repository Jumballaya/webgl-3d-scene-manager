import { TooltipProvider } from '@/shadcn/ui/tooltip';
import { ResizableHandle, ResizablePanelGroup } from '@/shadcn/ui/resizable';
import LeftSideBar from './model-viewer/left-sidebar';
import MiddleSection from './model-viewer/middle-section';
import RightSidebar from './model-viewer/right-sidebar';

export function ModelViewer() {
  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup direction="horizontal" className="items-stretch">
        <LeftSideBar />
        <ResizableHandle withHandle />
        <MiddleSection />
        <ResizableHandle withHandle />
        <RightSidebar />
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}
