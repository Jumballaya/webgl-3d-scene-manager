import useModelViewerCore from '@/core/useModelViewerCore';
import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/ui/card';
import { FormItem } from '@/shadcn/ui/form';
import { Input } from '@/shadcn/ui/input';
import { Label } from '@/shadcn/ui/label';
import { useEntityStore } from '@/store/entityStore';

function NameDetails() {
  const { currentlySelected } = useEntityStore();
  const mvc = useModelViewerCore();
  const nameComp = currentlySelected?.components.filter(
    (c) => c[0] === 'Name',
  )[0];
  if (!nameComp) {
    return <></>;
  }
  return (
    <Card className="p-1 my-4">
      <CardHeader className="p-3 pb-0">
        <CardTitle>
          <Label htmlFor="rotation-x" className="mr-2 text-xl">
            Name
          </Label>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <section>
          <FormItem>
            <Input
              type="text"
              id="rotation-x"
              value={(nameComp[1] as string) || ''}
              onChange={(e) => {
                mvc.updateComponentOnCurrentlySelected('Name', e.target.value);
              }}
            />
          </FormItem>
        </section>
      </CardContent>
    </Card>
  );
}

export default NameDetails;
