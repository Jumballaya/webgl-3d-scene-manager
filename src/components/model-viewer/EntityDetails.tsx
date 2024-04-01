import { ScrollArea } from '@/shadcn/ui/scroll-area';
import NameDetails from './entity-details/name-details';
import TransformDetails from './entity-details/transform-details';
import { Separator } from '@/shadcn/ui/separator';
import { EntityActions } from './entity-details/EntityActions';
import { RenderComponentSection } from './entity-details/RenderComponentSection';

export default function EntityDetails() {
  return (
    <>
      <h2 className="p-4 font-bold">Entity Details</h2>
      <Separator />
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
    </>
  );
}
