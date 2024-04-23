import { EntityComponentField } from './EntityComponentField';
import type { NumbertDetailProps } from './component-details.types';

export function EntityComponentVec3Field(props: {
  label: string;
  vec3: [NumbertDetailProps, NumbertDetailProps, NumbertDetailProps];
}) {
  return (
    <div>
      <h3 className="text-md mb-1">{props.label}</h3>
      <section className="flex flex-row justify-between mb-5">
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
