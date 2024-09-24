import useModelViewerCore from '@/core/useModelViewerCore';
import { Button } from '@/shadcn/ui/button';
import { Mesh } from '@/engine/render/mesh/Mesh';
import { useEntityStore } from '@/store/entityStore';
import { ComponentDetail } from './component-details/ComponentDetail';
import { FilePlus2Icon, Pencil } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shadcn/ui/tooltip';
import { DropdownSelect } from '@/components/DropdownSelect';

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
      <div className="px-3">
        <div className="flex flex-row justify-center items-center mb-3">
          <h3 className="text-lg mr-2">Geometry</h3>
          <DropdownSelect
            name="entity_details_geometry"
            onValueChange={(geometryName) => {
              const geometry =
                mvc.assetManager?.getGeometry(geometryName) ?? null;
              if (geometry) {
                meshComp.data.geometry = geometry.clone();
                mvc.updateComponentOnCurrentlySelected('Mesh', meshComp.data);
              }
            }}
            value={meshComp.data.geometry?.name ?? 'none'}
            options={geometryList ?? []}
            placeholder="Select a Geometry"
          />
        </div>
        <div className="flex flex-row justify-center items-center">
          <h3 className="text-lg mr-2">Material</h3>
          <DropdownSelect
            name="entity_details_materials"
            onValueChange={(materialName) => {
              const material =
                mvc.assetManager?.getMaterial(materialName) ?? null;
              if (material) {
                meshComp.data.material = material;
                mvc.updateComponentOnCurrentlySelected('Mesh', meshComp.data);
              }
            }}
            value={meshComp.data.material?.name ?? 'none'}
            options={materialList ?? []}
            placeholder="Select a Material"
          />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="p-1 ml-2 h-auto"
                onClick={(e) => {
                  e.preventDefault();
                  const name = `new-material-${crypto.randomUUID()}`;
                  const material = mvc.createMaterial(name);
                  if (material) {
                    meshComp.data.material = material;
                    mvc.updateComponentOnCurrentlySelected(
                      'Mesh',
                      meshComp.data,
                    );
                  }
                }}
              >
                <FilePlus2Icon size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Create New Material</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="p-1 ml-2 h-auto"
                onClick={(e) => {
                  e.preventDefault();
                }}
              >
                <Pencil size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Edit Material</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </ComponentDetail>
  );
}

export default MeshDetails;
