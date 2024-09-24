import { Button } from '@/shadcn/ui/button';
import { SpotLight } from '@/engine/render/light/SpotLight';
import { useState } from 'react';
import { Input } from '@/shadcn/ui/input';
import { EntityComponentVec3Field } from './component-details/EntityComponentVec3Field';

export function SpotLightDetails(props: { light: SpotLight }) {
  const { light } = props;
  const [values, setValues] = useState({
    direction: light.direction,
    innerAngle: light.innerAngle,
    outerAngle: light.outerAngle,
  });
  return (
    <div className="mt-4">
      <form
        id="material-details"
        name="material-details"
        onSubmit={(e) => {
          e.preventDefault();
          light.direction = values.direction;
          light.innerAngle = values.innerAngle;
          light.outerAngle = values.outerAngle;
        }}
      >
        <EntityComponentVec3Field
          label="Direction"
          vec3={[
            {
              label: 'X',
              id: 'light-direction-x',
              type: 'number',
              startingValue: values.direction[0],
              onChange: (v: number) =>
                setValues({
                  ...values,
                  direction: [v, values.direction[1], values.direction[2]],
                }),
              step: 0.01,
            },
            {
              label: 'Y',
              id: 'light-direction-y',
              type: 'number',
              startingValue: values.direction[1],
              onChange: (v: number) =>
                setValues({
                  ...values,
                  direction: [values.direction[0], v, values.direction[2]],
                }),
              step: 0.01,
            },
            {
              label: 'Z',
              id: 'light-direction-z',
              type: 'number',
              startingValue: values.direction[2],
              onChange: (v: number) =>
                setValues({
                  ...values,
                  direction: [values.direction[0], values.direction[1], v],
                }),
              step: 0.01,
            },
          ]}
        />

        <h3 className="text-md mb-1">Inner Angle</h3>
        <section className="flex mb-4">
          <Input
            type="number"
            id="light-inner-angle"
            className="px-2 py-1 w-full h-auto"
            value={values.innerAngle}
            step={Math.PI / 90}
            min={0.0}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              if (isNaN(val)) return;
              setValues({
                ...values,
                innerAngle: val,
              });
            }}
          />
        </section>

        <h3 className="text-md mb-1">Outer Angle</h3>
        <section className="flex mb-4">
          <Input
            type="number"
            id="light-outer-angle"
            className="px-2 py-1 w-full h-auto"
            value={values.outerAngle}
            step={Math.PI / 90}
            min={0}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              if (isNaN(val)) return;
              setValues({
                ...values,
                outerAngle: val,
              });
            }}
          />
        </section>
        <Button className="px-2 py-1 h-auto">Update Spotlight</Button>
      </form>
    </div>
  );
}
