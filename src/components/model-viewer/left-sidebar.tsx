import { ResizablePanel } from '@/shadcn/ui/resizable';
import EntityList from './entity-list/EntityList';
import { AssetViewer } from './asset-viewer/AssetViewer';
import { EditorTabName, useEditorStore } from '@/store/editorStore';
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
  const { currentTab } = useEditorStore();
  const LeftSideBarElement = elements[currentTab];
  const title = titles[currentTab];
  return (
    <ResizablePanel minSize={10} maxSize={18} defaultSize={12}>
      <h2 className="py-4 px-4 font-bold">{title}</h2>
      <Separator />
      <ScrollArea style={{ height: '100%' }}>
        <LeftSideBarElement />
      </ScrollArea>
    </ResizablePanel>
  );
}
