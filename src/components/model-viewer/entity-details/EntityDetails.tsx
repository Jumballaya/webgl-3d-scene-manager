import { ScrollArea } from '@/shadcn/ui/scroll-area';
import NameDetails from './NameDetails';
import TransformDetails from './TransformDetails';
import { EntityActions } from './EntityActions';
import { ScriptsDetails } from './ScriptsDetails';
import { LightDetails } from './LightDetails';
import MeshDetails from './MeshDetails';

export default function EntityDetails() {
  return (
    <ScrollArea className="h-90 w-full">
      <div className="w-full h-full">
        <EntityActions />
        <NameDetails />
        <TransformDetails />
        <LightDetails />
        <MeshDetails />
        <ScriptsDetails />
      </div>
    </ScrollArea>
  );
}
