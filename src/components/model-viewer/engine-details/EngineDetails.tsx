import useModelViewerCore from '@/core/useModelViewerCore';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shadcn/ui/accordion';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/shadcn/ui/card';
import { Switch } from '@/shadcn/ui/switch';
import { useEffect, useState } from 'react';

function PostProcessorEntry(props: {
  name: string;
  description: string;
  enabled: boolean;
  onChange: () => void;
}) {
  return (
    <div className="space-y-4 mb-2">
      <Card className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
        <div className="space-y-0.5">
          <CardTitle className="text-md">{props.name}</CardTitle>
          <CardDescription className="text-xs">
            {props.description}
          </CardDescription>
        </div>
        <CardContent className="p-0 pl-3">
          <Switch checked={props.enabled} onCheckedChange={props.onChange} />
        </CardContent>
      </Card>
    </div>
  );
}

export function EngineDetails() {
  const mvc = useModelViewerCore();
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const postEffects = mvc.getPostEffects();

  useEffect(() => {
    const update: Record<string, boolean> = {};
    for (const pe of postEffects) {
      update[pe.name] = pe.enabled;
    }
    setChecked(update);
  }, [mvc, postEffects]);

  return (
    <div className="w-full">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger className="px-3">Post Processors</AccordionTrigger>
          <AccordionContent className="px-2">
            {postEffects.map((fx) => (
              <PostProcessorEntry
                key={`${fx.name}-post-process-effect`}
                name={fx.name}
                description={fx.description}
                enabled={checked[fx.name] ?? false}
                onChange={() => {
                  fx.enabled = !fx.enabled;
                  setChecked({
                    [fx.name]: fx.enabled,
                  });
                }}
              />
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
