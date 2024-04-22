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
import { ComponentDetail } from './component-details/ComponentDetail';

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
    <ComponentDetail title="Actions">
      <div className="flex flex-row p-3">
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
              mvc.addComponentToCurrentlySelected('Transform', new Transform());
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
    </ComponentDetail>
  );
}
