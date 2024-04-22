import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/ui/card';
import { EntityComponentField } from './EntityComponentField';
import type { NumbertDetailProps } from './component-details.types';

export function EntityComponentVec3Field(props: {
  label: string;
  vec3: [NumbertDetailProps, NumbertDetailProps, NumbertDetailProps];
}) {
  return (
    <Card className="p-1 mb-2">
      <CardHeader className="p-1">
        <CardTitle className="text-md">{props.label}</CardTitle>
      </CardHeader>
      <CardContent className="p-1">
        <section className="flex flex-row justify-around">
          {props.vec3.map((input) => (
            <EntityComponentField
              key={input.id}
              label={input.label}
              type={input.type}
              id={input.id}
              startingValue={input.startingValue}
              step={input.step}
              min={input.min}
              max={input.max}
              onChange={input.onChange}
            />
          ))}
        </section>
      </CardContent>
    </Card>
  );
}
