import { ScrollArea } from '@/shadcn/ui/scroll-area';
import NameDetails from './entity-details/name-details';
import TransformDetails from './entity-details/transform-details';
import { EntityActions } from './entity-details/EntityActions';
import { RenderComponentSection } from './entity-details/RenderComponentSection';

export default function EntityDetails() {
  return (
    <ScrollArea className="p-2 h-90">
      <EntityActions />
      <section id="entity-details-universal-components">
        <NameDetails />
        <TransformDetails />
      </section>
      <section id="entity-details-render-components">
        <RenderComponentSection />
      </section>
    </ScrollArea>
  );
}
