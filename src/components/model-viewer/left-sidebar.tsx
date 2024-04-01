import { ResizablePanel } from '@/shadcn/ui/resizable';
import EntityList from './entity-list/EntityList';
import { AssetViewer } from './AssetViewer';

export default function LeftSideBar() {
  return (
    <ResizablePanel minSize={10} maxSize={18} defaultSize={12}>
      <EntityList />
      <AssetViewer />
    </ResizablePanel>
  );
}
