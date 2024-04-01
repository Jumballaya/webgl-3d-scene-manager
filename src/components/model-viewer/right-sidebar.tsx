import { ResizablePanel } from '@/shadcn/ui/resizable';
import EntityDetails from './EntityDetails';

export default function RightSidebar() {
  return (
    <ResizablePanel minSize={12} maxSize={26} defaultSize={18}>
      <EntityDetails />
    </ResizablePanel>
  );
}
