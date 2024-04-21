import { ResizablePanel } from '@/shadcn/ui/resizable';
import EntityList from './entity-list/EntityList';
import { AssetViewer } from './AssetViewer';
import { EditorTabName, useEditorStore } from '@/store/editorStore';
import { TextFileViewer } from './TextFileViewer';

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

export default function LeftSideBar() {
  const { currentTab } = useEditorStore();
  const LeftSideBarElement = elements[currentTab];
  return (
    <ResizablePanel minSize={10} maxSize={18} defaultSize={12}>
      <LeftSideBarElement />
    </ResizablePanel>
  );
}
