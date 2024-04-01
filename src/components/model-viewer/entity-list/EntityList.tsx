import { ScrollArea } from '@/shadcn/ui/scroll-area';
import { Separator } from '@/shadcn/ui/separator';
import { useEntityStore } from '@/store/entityStore';
import { EntityListParent } from './EntityListParent';
import { EntityListCommands } from './EntityListCommands';
import useModelViewerCore from '@/core/useModelViewerCore';

export default function EntityList() {
  const { entities, currentlySelected } = useEntityStore((state) => state);
  const mvc = useModelViewerCore();

  return (
    <div>
      <h2 className="py-4 px-4 font-bold">Entity List</h2>
      <Separator />
      <ScrollArea className="h-72">
        <ul className="mx-2 list-none">
          {entities.map((e, i) => (
            <EntityListParent
              key={`${e.id}-parent`}
              index={i}
              entity={e}
              selectEntity={(id: number) => {
                mvc.setCurrentlySelected(mvc.getEntityById(id));
              }}
              currentlySelected={currentlySelected?.id ?? null}
              level={0}
            />
          ))}
        </ul>
      </ScrollArea>
      <Separator />
      <EntityListCommands />
      <Separator />
    </div>
  );
}
