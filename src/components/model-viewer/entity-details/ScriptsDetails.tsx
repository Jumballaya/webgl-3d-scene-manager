import useModelViewerCore from '@/core/useModelViewerCore';
import { ScriptData } from '@/engine/scripting/scripts.types';
import { Button } from '@/shadcn/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/ui/card';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shadcn/ui/select';
import { useEntityStore } from '@/store/entityStore';
import { useEffect, useState } from 'react';

function AddScript() {
  const mvc = useModelViewerCore();
  return (
    <Card className="p-1 my-4">
      <CardHeader className="p-3 pb-0"></CardHeader>
      <CardContent className="p-3">
        <Button
          onClick={(e) => {
            e.preventDefault();
            mvc.addComponentToCurrentlySelected('Script', {});
          }}
          id="create-child"
        >
          Add Script Component
        </Button>
      </CardContent>
    </Card>
  );
}

export function ScriptsDetails() {
  const { currentlySelected, scriptList } = useEntityStore();
  const mvc = useModelViewerCore();
  const scriptsComp = currentlySelected?.components.filter(
    (c) => c[0] === 'Script',
  )[0] as [string, ScriptData] | undefined;
  const scriptData = scriptsComp?.[1];
  const [scripts, setScripts] = useState<ScriptData | null>(scriptData ?? null);
  const [scriptUI, setScriptUI] = useState<{ update: string }>({
    update: 'none',
  });

  // runs when currentlySelected changes
  useEffect(() => {
    if (currentlySelected) {
      const scriptsComp = currentlySelected?.components.filter(
        (c) => c[0] === 'Script',
      )[0] as [string, ScriptData] | undefined;
      const script = scriptsComp?.[1];
      setScripts(script ?? null);
    }
  }, [currentlySelected]);

  if (!currentlySelected) {
    return <></>;
  }
  if (!scriptsComp || !scriptData) {
    return <AddScript />;
  }
  return (
    <Card className="my-4">
      <CardHeader className="p-3 pb-1">
        <CardTitle className="text-xl">Scripts</CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <Card className="p-1 my-4">
          <CardHeader className="p-3 pb-0">
            <CardTitle className="text-md">On Update</CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            <section className="mb-2">
              <Select
                onValueChange={(update) => {
                  // update which script is used
                  setScriptUI({ ...scriptUI, update });
                  mvc.setScriptOnCurrentlySelected('update', update);
                }}
                value={scriptUI.update}
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
            </section>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
