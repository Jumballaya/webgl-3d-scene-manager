import { Card, CardContent } from '@/shadcn/ui/card';
import { Button } from '@/shadcn/ui/button';
import useModelViewerCore from '@/core/useModelViewerCore';
import { useEntityStore } from '@/store/entityStore';

export function EntityActions() {
  const mvc = useModelViewerCore();
  const { currentlySelected } = useEntityStore();

  if (!currentlySelected) {
    return <></>;
  }

  return (
    <Card className="p-1 my-4">
      <CardContent className="flex flex-row p-3">
        <Button
          className="mr-3"
          onClick={(e) => {
            e.preventDefault();
            const ent = mvc.getCurrentlySelected();
            if (ent) {
              const child = mvc.addEntity();
              mvc.addChildToEntity(ent, child);
            }
          }}
          id="create-child"
        >
          Add Child
        </Button>
        <Button
          className="mr-3"
          onClick={(e) => {
            e.preventDefault();
            // const ent = mvc.getCurrentlySelected();
            // clone entity to the same parent/child level the original is on
          }}
          id="create-child"
          variant={'secondary'}
        >
          Clone
        </Button>
        <Button
          onClick={(e) => {
            e.preventDefault();
            mvc.deleteEntity(currentlySelected.id);
          }}
          id="create-child"
          variant={'destructive'}
        >
          Delete
        </Button>
      </CardContent>
    </Card>
  );
}
