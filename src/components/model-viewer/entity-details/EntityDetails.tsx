import { ScrollArea } from '@/shadcn/ui/scroll-area';
import NameDetails from './NameDetails';
import TransformDetails from './TransformDetails';
import { EntityActions } from './EntityActions';
import { RenderComponentSection } from './RenderComponentSection';
import { ScriptsDetails } from './ScriptsDetails';

export default function EntityDetails() {
  return (
    <ScrollArea className="h-90 w-full">
      <div className="p-2  w-full h-full">
        <EntityActions />
        <section>
          <NameDetails />
          <TransformDetails />
        </section>
        <section>
          <RenderComponentSection />
          <ScriptsDetails />
        </section>
      </div>
    </ScrollArea>
  );
}
