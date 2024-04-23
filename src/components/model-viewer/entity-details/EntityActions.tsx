import { Button } from '@/shadcn/ui/button';
import useModelViewerCore from '@/core/useModelViewerCore';
import { useEntityStore } from '@/store/entityStore';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shadcn/ui/select';
import { useEffect, useState } from 'react';
import { Transform } from '@/engine/math/Transform';
import { Separator } from '@/shadcn/ui/separator';
import { Prefab } from '@/engine/ecs/Prefab';

export function EntityActions() {
  const mvc = useModelViewerCore();
  const { currentlySelected } = useEntityStore();
  const [componentList, setComponentList] = useState<string[]>(
    mvc.ecs.componentList,
  );
  useEffect(() => {
    if (currentlySelected) {
      const entComponents = currentlySelected.components.map((c) => c[0]);
      setComponentList(
        mvc.ecs.componentList.filter((comp) => {
          if (entComponents.includes(comp)) return false;
          if (entComponents.includes('Mesh') && comp === 'Light') return false;
          if (entComponents.includes('Light') && comp === 'Mesh') return false;
          return true;
        }),
      );
    }
  }, [currentlySelected, mvc.ecs.componentList]);

  if (!currentlySelected) {
    return <></>;
  }

  return (
    <div>
      <div className="px-2 mb-9">
        <div className="flex flex-row flex-wrap pb-4">
          <Button
            size="sm"
            className="mr-2 mt-2 p-2"
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
            size="sm"
            className="mr-2 mt-2 p-2"
            onClick={(e) => {
              e.preventDefault();
              const ent = mvc.getCurrentlySelected();
              if (ent) {
                const clone = mvc.cloneEntity(ent);
                mvc.setCurrentlySelected(clone);
              }
            }}
            id="clone-entity"
            variant={'secondary'}
          >
            Clone
          </Button>
          <Button
            size="sm"
            className="mr-2 mt-2 p-2"
            onClick={(e) => {
              e.preventDefault();
              const entity = mvc.getCurrentlySelected();
              if (entity) {
                const prefab = Prefab.FromEntity(entity, mvc.ecs);
                mvc.registerPrefab(prefab);
              }
            }}
            id="create-prefab"
            variant={'secondary'}
          >
            Generate Prefab
          </Button>
          <Button
            size="sm"
            className="mt-2 p-2"
            onClick={(e) => {
              e.preventDefault();
              e.preventDefault();
              mvc.deleteEntity(currentlySelected.id);
            }}
            id="delete-entity"
            variant={'destructive'}
          >
            Delete
          </Button>
        </div>
        <Select
          disabled={componentList.length === 0}
          onValueChange={(componentName) => {
            switch (componentName) {
              case 'Name': {
                mvc.addComponentToCurrentlySelected('Name', '');
                break;
              }
              case 'Transform': {
                mvc.addComponentToCurrentlySelected(
                  'Transform',
                  new Transform(),
                );
                break;
              }
              case 'Mesh': {
                const name =
                  mvc.getCurrentlySelected()?.getComponent<string>('Name')
                    ?.data ?? '';
                const mesh = mvc.createMesh(name);
                mvc.addComponentToCurrentlySelected('Mesh', mesh);
                break;
              }
              case 'Light': {
                const light = mvc.createLight('point');
                if (light) {
                  mvc.addComponentToCurrentlySelected('Light', light);
                }
                break;
              }
              case 'Script': {
                mvc.addComponentToCurrentlySelected('Script', {});
              }
            }
          }}
          value={''}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Add a Component" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {(componentList ?? []).map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Separator />
    </div>
  );
}
