import { EntityComponentField } from './EntityComponentField';
import type { NumberDetailProps } from './component-details.types';

export function EntityComponentVec3Field(props: {
  label: string;
  vec3: [NumberDetailProps, NumberDetailProps, NumberDetailProps];
}) {
  return (
    <div>
      <h3 className="text-md m-0 mb-1 p-0 h-auto">{props.label}</h3>
      <section className="flex flex-row justify-between mb-3">
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
    </div>
  );
}
