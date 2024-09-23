import { Box, Copy, Grid3X3, Lightbulb, Trash2 } from 'lucide-react';
import useModelViewerCore from '@/core/useModelViewerCore';
import { Light } from '@/engine/render/light/Light';
import { useEntityStore } from '@/store/entityStore';
import { ActionBar, ActionBarProps } from '@/components/ActionBar';

export function EntityListCommands() {
  const mvc = useModelViewerCore();
  const { currentlySelected } = useEntityStore();
  const entries: ActionBarProps['entries'] = [
    {
      variant: 'ghost',
      onClick: () => {
        const ent = mvc.addEntity();
        mvc.setCurrentlySelected(ent);
      },
      icon: Box,
      tooltip: 'Create Entity',
    },
    {
      variant: 'ghost',
      onClick: () => {
        const ent = mvc.addEntity('mesh');
        mvc.setCurrentlySelected(ent);
      },
      icon: Grid3X3,
      tooltip: 'Create Mesh',
    },
    {
      variant: 'ghost',
      onClick: () => {
        const ent = mvc.addEntity('light');
        mvc.setCurrentlySelected(ent);
      },
      icon: Lightbulb,
      tooltip: 'Create Light',
    },
  ];

  if (currentlySelected) {
    entries.push({
      variant: 'ghost',
      onClick: () => {
        const ent = mvc.getCurrentlySelected();
        if (ent) {
          const clone = mvc.cloneEntity(ent);
          mvc.setCurrentlySelected(clone);
        }
      },
      icon: Copy,
      tooltip: 'Clone Selected Entity',
    });
    entries.push({
      variant: 'ghost',
      onClick: () => {
        const currentlySelected = mvc.getCurrentlySelected();
        if (currentlySelected) {
          mvc.deleteEntity(currentlySelected.id);
          const lightComp = currentlySelected.getComponent<Light>('Light');
          if (lightComp) {
            mvc.removeLight(lightComp.data);
          }
        }
      },
      icon: Trash2,
      tooltip: 'Delete Entity',
    });
  }

  return (
    <div className="flex flex-row items-center px-0">
      <ActionBar name="entity_list" entries={entries} />
    </div>
  );
}
