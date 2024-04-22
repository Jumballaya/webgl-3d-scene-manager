import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/ui/card';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shadcn/ui/select';
import useModelViewerCore from '@/core/useModelViewerCore';
import { Button } from '@/shadcn/ui/button';
import { AddRenderComponent } from './AddRenderComponent';
import { Mesh } from '@/engine/render/mesh/Mesh';
import { ReactElement } from 'react';
import { cn } from '@/shadcn/lib/utils';
import { useEntityStore } from '@/store/entityStore';
import MaterialDetails from './material-details';

type DetailProps = {
  children?: ReactElement | ReactElement[] | undefined;
  title: string;
  onDelete?: () => void;
  size: 'sm' | 'lg';
};

function Detail(props: DetailProps) {
  const { size, title, children, onDelete } = props;
  return (
    <Card className="p-1 pb-3 my-4">
      <CardHeader className="p-3 pb-0">
        <CardTitle className={cn(size === 'sm' && 'text-xl')}>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <section className="mb-2">{children}</section>
      </CardContent>
      {onDelete && (
        <Button
          className="ml-3"
          onClick={(e) => {
            e.preventDefault();
            onDelete?.();
          }}
          variant={'destructive'}
        >
          Remove
        </Button>
      )}
    </Card>
  );
}

function MeshDetails() {
  const mvc = useModelViewerCore();
  const currentlySelected = mvc.getCurrentlySelected();
  const { geometryList, materialList } = useEntityStore();
  if (!currentlySelected) {
    return <></>;
  }
  const lightComp = currentlySelected.getComponent('Light');
  if (lightComp) {
    return <></>;
  }

  const meshComp = currentlySelected.getComponent<Mesh>('Mesh');
  if (!meshComp) {
    return <AddRenderComponent />;
  }
  return (
    <Detail
      title="Mesh"
      size="lg"
      onDelete={() => {
        mvc.removeComponentFromCurrentlySelected('Mesh');
      }}
    >
      <Detail title="Geometry" size="sm">
        <Select
          onValueChange={(geometryName) => {
            const geometry =
              mvc.assetManager?.getGeometry(geometryName) ?? null;
            if (geometry) {
              meshComp.data.geometry = geometry.clone();
              mvc.updateComponentOnCurrentlySelected('Mesh', meshComp.data);
            }
          }}
          value={meshComp.data.geometry?.name ?? 'none'}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a geometry" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {(geometryList ?? []).map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Detail>

      <Detail title="Material" size="sm">
        <Select
          onValueChange={(materialName) => {
            const material =
              mvc.assetManager?.getMaterial(materialName) ?? null;
            if (material) {
              meshComp.data.material = material;
              mvc.updateComponentOnCurrentlySelected('Mesh', meshComp.data);
            }
          }}
          value={meshComp.data.material?.name ?? 'none'}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a material" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {(materialList ?? []).map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button
          onClick={() => {
            const name = `new-material-${crypto.randomUUID()}`;
            const material = mvc.createMaterial(name);
            if (material) {
              meshComp.data.material = material;
              mvc.updateComponentOnCurrentlySelected('Mesh', meshComp.data);
            }
          }}
          className="mt-5"
        >
          Create New Material
        </Button>
      </Detail>

      <MaterialDetails />
    </Detail>
  );
}

export default MeshDetails;
