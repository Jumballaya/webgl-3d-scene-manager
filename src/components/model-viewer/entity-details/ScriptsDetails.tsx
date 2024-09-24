import useModelViewerCore from '@/core/useModelViewerCore';
import { ScriptData } from '@/engine/scripting/scripts.types';
import { Button } from '@/shadcn/ui/button';
import { useEditorStore } from '@/store/editorStore';
import { useEntityStore } from '@/store/entityStore';
import { Pencil } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ComponentDetail } from './component-details/ComponentDetail';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shadcn/ui/tooltip';
import { DropdownSelect } from '@/components/DropdownSelect';

const defaultScript: ScriptData = {
  update: 'none',
};

export function ScriptsDetails() {
  const { currentlySelected, scriptList } = useEntityStore();
  const editorStore = useEditorStore();
  const mvc = useModelViewerCore();
  const scriptsComp = currentlySelected?.components.filter(
    (c) => c[0] === 'Script',
  )[0] as [string, ScriptData] | undefined;
  const scriptData = scriptsComp?.[1];
  const [scripts, setScripts] = useState<ScriptData>(defaultScript);

  // runs when currentlySelected changes
  useEffect(() => {
    if (currentlySelected) {
      const scriptsComp = currentlySelected?.components.filter(
        (c) => c[0] === 'Script',
      )[0] as [string, ScriptData] | undefined;
      const script = scriptsComp?.[1];
      setScripts(script ?? defaultScript);
    }
  }, [currentlySelected]);

  if (!currentlySelected || !scriptsComp || !scriptData) {
    return <></>;
  }
  return (
    <ComponentDetail
      title="Scripts"
      onDestroy={() => {
        mvc.removeComponentFromCurrentlySelected('Script');
      }}
    >
      <div className="flex flex-row items-center">
        <h3 className="mr-2 text-lg">Update</h3>
        <DropdownSelect
          name="entity_details_script"
          onValueChange={(update) => {
            // update which script is used
            setScripts({ ...scripts, update });
            mvc.setScriptOnCurrentlySelected('update', update);
          }}
          value={scripts.update ?? 'none'}
          options={scriptList}
          placeholder="Select a Script"
        />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="p-1 ml-2 h-auto"
              onClick={(e) => {
                e.preventDefault();
                if (scripts.update && scripts.update !== 'none') {
                  editorStore.setCurrentTab('text-editor');
                  editorStore.openFileTab(scripts.update);
                  editorStore.setCurrentTextFile(scripts.update);
                }
              }}
            >
              <Pencil size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Edit Script</TooltipContent>
        </Tooltip>
      </div>
    </ComponentDetail>
  );
}
