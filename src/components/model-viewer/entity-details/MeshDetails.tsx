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
import { Mesh } from '@/engine/render/mesh/Mesh';
import { useEntityStore } from '@/store/entityStore';
import MaterialDetails from './MaterialDetails';
import { ComponentDetail } from './component-details/ComponentDetail';
import { FilePlus2Icon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shadcn/ui/tooltip';

function MeshDetails() {
  const mvc = useModelViewerCore();
  const currentlySelected = mvc.getCurrentlySelected();
  const { geometryList, materialList } = useEntityStore();
  const meshComp = currentlySelected?.getComponent<Mesh>('Mesh');
  if (!currentlySelected || !meshComp) {
    return <></>;
  }

  return (
    <ComponentDetail
      title="Mesh"
      onDestroy={() => {
        mvc.removeComponentFromCurrentlySelected('Mesh');
      }}
    >
      <div className="flex flex-row justify-center items-center mb-3">
        <h3 className="text-lg mr-2">Geometry</h3>
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
      </div>
      <div className="flex flex-row justify-center items-center">
        <h3 className="text-lg mr-2">Material</h3>
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
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="p-2 ml-2"
              onClick={(e) => {
                e.preventDefault();
                const name = `new-material-${crypto.randomUUID()}`;
                const material = mvc.createMaterial(name);
                if (material) {
                  meshComp.data.material = material;
                  mvc.updateComponentOnCurrentlySelected('Mesh', meshComp.data);
                }
              }}
            >
              <FilePlus2Icon size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Create New Material</TooltipContent>
        </Tooltip>
      </div>
      <MaterialDetails />
    </ComponentDetail>
  );
}

export default MeshDetails;
