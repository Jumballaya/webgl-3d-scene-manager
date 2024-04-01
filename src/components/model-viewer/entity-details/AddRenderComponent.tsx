import { Card, CardContent, CardHeader } from '@/shadcn/ui/card';
import useModelViewerCore from '@/core/useModelViewerCore';
import { Button } from '@/shadcn/ui/button';

export function AddRenderComponent() {
  const mvc = useModelViewerCore();
  return (
    <Card className="p-1 my-4">
      <CardHeader className="p-3 pb-0"></CardHeader>
      <CardContent className="p-3 flex flex-row justify-between">
        <Button
          onClick={(e) => {
            e.preventDefault();
            const name =
              mvc.getCurrentlySelected()?.getComponent<string>('Name')?.data ??
              '';
            const mesh = mvc.createMesh(name);
            mvc.addComponentToCurrentlySelected('Mesh', mesh);
          }}
          id="create-child"
        >
          Add Mesh
        </Button>
        <Button
          onClick={(e) => {
            e.preventDefault();
            const light = mvc.createLight('point');
            if (light) {
              mvc.addComponentToCurrentlySelected('Light', light);
            }
          }}
          id="create-child"
        >
          Add Light
        </Button>
      </CardContent>
    </Card>
  );
}
