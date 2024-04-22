import useModelViewerCore from '@/core/useModelViewerCore';
import { ScriptData } from '@/engine/scripting/scripts.types';
import { Button } from '@/shadcn/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shadcn/ui/select';
import { useEditorStore } from '@/store/editorStore';
import { useEntityStore } from '@/store/entityStore';
import { CodeIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ComponentDetail } from './component-details/ComponentDetail';

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
        <Select
          onValueChange={(update) => {
            // update which script is used
            setScripts({ ...scripts, update });
            mvc.setScriptOnCurrentlySelected('update', update);
          }}
          value={scripts.update}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a script" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {scriptList.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button
          className="p-2 ml-2"
          onClick={(e) => {
            e.preventDefault();
            if (scripts.update && scripts.update !== 'none') {
              editorStore.setCurrentTab('text-editor');
              editorStore.openFileTab(scripts.update);
              editorStore.setCurrentTextFile(scripts.update);
            }
          }}
        >
          <CodeIcon size={16} />
        </Button>
      </div>
    </ComponentDetail>
  );
}
