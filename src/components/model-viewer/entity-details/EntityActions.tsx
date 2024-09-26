import useModelViewerCore from '@/core/useModelViewerCore';
import { useEntityStore } from '@/store/entityStore';
import { useEffect, useState } from 'react';
import { Transform } from '@/engine/math/Transform';
import { Separator } from '@/shadcn/ui/separator';
import { Prefab } from '@/engine/ecs/Prefab';
import { BookCopy, Trash2, UserPlus } from 'lucide-react';
import { ActionBar, ActionBarProps } from '@/components/ActionBar';
import { DropdownSelect } from '@/components/DropdownSelect';

export function EntityActions() {
  const mvc = useModelViewerCore();
  const { currentlySelected } = useEntityStore();
  const [componentList, setComponentList] = useState<string[]>(
    mvc.ecs.componentList,
  );
  const [compList, setCompList] = useState<
    { value: string; display: string }[]
  >([]);
  useEffect(() => {
    setCompList((componentList ?? []).map((m) => ({ value: m, display: m })));
  }, [componentList]);
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

  const entries: ActionBarProps['entries'] = [
    {
      variant: 'ghost',
      onClick: () => {
        const ent = mvc.getCurrentlySelected();
        if (ent) {
          const child = mvc.addEntity();
          mvc.addChildToEntity(ent, child);
        }
      },
      icon: UserPlus,
      tooltip: 'Add Child',
    },
    {
      variant: 'ghost',
      onClick: () => {
        const ent = mvc.getCurrentlySelected();
        if (ent) {
          const clone = mvc.cloneEntity(ent);
          mvc.setCurrentlySelected(clone);
        }
      },
      icon: BookCopy,
      tooltip: 'Clone',
    },
    {
      variant: 'ghost',
      onClick: () => {
        const entity = mvc.getCurrentlySelected();
        if (entity) {
          const prefab = Prefab.FromEntity(entity, mvc.ecs);
          mvc.registerPrefab(prefab);
        }
      },
      icon: BookCopy,
      tooltip: 'Generate Prefab',
    },
    {
      variant: 'destructive',
      onClick: () => {
        const entity = mvc.getCurrentlySelected();
        if (entity) {
          mvc.deleteEntity(currentlySelected.id);
        }
      },
      icon: Trash2,
      tooltip: 'Delete Entity',
    },
  ];

  return (
    <>
      <ActionBar name="entity_details" entries={entries} />
      <Separator className="mb-4" />
      <div className="px-2 mb-4">
        <DropdownSelect
          name="entity_details_component_choice"
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
          options={compList}
          placeholder="Add a Component"
        />
      </div>
      <Separator />
    </>
  );
}
