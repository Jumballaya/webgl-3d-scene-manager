import { Label } from '@/shadcn/ui/label';
import { Button } from '@/shadcn/ui/button';
import { SpotLight } from '@/engine/render/light/SpotLight';
import { useState } from 'react';
import { FormItem } from '@/shadcn/ui/form';
import { Input } from '@/shadcn/ui/input';

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
        <h3 className="text-md mb-1">Direction</h3>
        <section className="flex flex-row justify-between mb-5">
          <FormItem className="flex flex-row items-baseline mr-2">
            <Label htmlFor="light-direction-x" className="mr-2">
              X
            </Label>
            <Input
              type="number"
              id="light-direction-x"
              className="h-8 px-1"
              value={values.direction[0]}
              step={0.01}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (isNaN(val)) return;
                setValues({
                  ...values,
                  direction: [val, values.direction[1], values.direction[2]],
                });
              }}
            />
          </FormItem>
          <FormItem className="flex flex-row items-baseline mr-2">
            <Label htmlFor="light-direction-y" className="mr-2">
              Y
            </Label>
            <Input
              type="number"
              id="light-direction-y"
              className="h-8 px-1"
              value={values.direction[1]}
              step={0.01}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (isNaN(val)) return;
                setValues({
                  ...values,
                  direction: [values.direction[0], val, values.direction[2]],
                });
              }}
            />
          </FormItem>
          <FormItem className="flex flex-row items-baseline">
            <Label htmlFor="light-direction-z" className="mr-2">
              Z
            </Label>
            <Input
              type="number"
              id="light-direction-z"
              className="h-8 px-1"
              value={values.direction[2]}
              step={0.01}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (isNaN(val)) return;
                setValues({
                  ...values,
                  direction: [values.direction[0], values.direction[1], val],
                });
              }}
            />
          </FormItem>
        </section>
        <h3 className="text-md mb-3">Inner Angle</h3>
        <section className="flex mb-5">
          <Input
            type="number"
            id="light-inner-angle"
            className="px-1 block w-full"
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

        <h3 className="text-md mb-3">Outer Angle</h3>
        <section className="flex mb-5">
          <Input
            type="number"
            id="light-outer-angle"
            className="px-1 block w-full"
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
        <Button>Update Spotlight</Button>
      </form>
    </div>
  );
}
