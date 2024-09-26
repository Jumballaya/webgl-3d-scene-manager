import { ResizablePanel } from '@/shadcn/ui/resizable';
import EntityList from './entity-list/EntityList';
import { AssetViewer } from './asset-viewer/AssetViewer';
import { EditorTabName } from '@/store/editorStore';
import { TextFileViewer } from './text-editor/TextFileViewer';
import { Separator } from '@/shadcn/ui/separator';
import { ScrollArea } from '@/shadcn/ui/scroll-area';

function EntityDetails() {
  return (
    <>
      <EntityList />
      <AssetViewer />
    </>
  );
}

const elements: Record<EditorTabName, () => JSX.Element> = {
  '3d-viewer': EntityDetails,
  'text-editor': TextFileViewer,
};

// @TODO: Move this to state?
const titles: Record<EditorTabName, string> = {
  '3d-viewer': 'Entity List',
  'text-editor': 'Text Files',
};

export default function LeftSideBar() {
  const currentTab = '3d-viewer';
  const LeftSideBarElement = elements[currentTab];
  const title = titles[currentTab];
  const pixelPercent = 100 / window.innerWidth;
  return (
    <ResizablePanel
      minSize={200 * pixelPercent}
      maxSize={300 * pixelPercent}
      defaultSize={200 * pixelPercent}
    >
      <h2 className="py-2 px-4 font-bold">{title}</h2>
      <Separator />
      <ScrollArea>
        <LeftSideBarElement />
      </ScrollArea>
    </ResizablePanel>
  );
}
