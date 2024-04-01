import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/ui/card';
import { Label } from '@/shadcn/ui/label';
import { Button } from '@/shadcn/ui/button';
import { SpotLight } from '@/renderer/viewer/light/SpotLight';
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
    <Card className="p-1 my-4">
      <CardHeader className="p-3 pb-0">
        <CardTitle>
          <Label htmlFor="rotation-x" className="mr-2 text-lg">
            Spot Light
          </Label>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3">
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
          <Card className="p-1 mb-2">
            <CardHeader className="p-1">
              <CardTitle className="text-md">Direction</CardTitle>
            </CardHeader>
            <CardContent className="p-1">
              <section className="flex flex-row justify-around">
                <FormItem className="flex flex-row items-baseline">
                  <Label htmlFor="light-direction-x" className="mr-2">
                    X
                  </Label>
                  <Input
                    type="number"
                    id="light-direction-x"
                    className="h-8 w-12 px-1"
                    value={values.direction[0]}
                    step={0.01}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (isNaN(val)) return;
                      setValues({
                        ...values,
                        direction: [
                          val,
                          values.direction[1],
                          values.direction[2],
                        ],
                      });
                    }}
                  />
                </FormItem>
                <FormItem className="flex flex-row items-baseline">
                  <Label htmlFor="light-direction-y" className="mr-2">
                    Y
                  </Label>
                  <Input
                    type="number"
                    id="light-direction-y"
                    className="h-8 w-12 px-1"
                    value={values.direction[1]}
                    step={0.01}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (isNaN(val)) return;
                      setValues({
                        ...values,
                        direction: [
                          values.direction[0],
                          val,
                          values.direction[2],
                        ],
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
                    className="h-8 w-12 px-1"
                    value={values.direction[2]}
                    step={0.01}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (isNaN(val)) return;
                      setValues({
                        ...values,
                        direction: [
                          values.direction[0],
                          values.direction[1],
                          val,
                        ],
                      });
                    }}
                  />
                </FormItem>
              </section>
            </CardContent>
          </Card>

          <Card className="p-1 mb-2">
            <CardHeader className="p-1">
              <CardTitle className="text-md">Inner Angle</CardTitle>
            </CardHeader>
            <CardContent className="p-1">
              <section className="flex">
                <FormItem className="flex flex-row items-baseline">
                  <Input
                    type="number"
                    id="light-inner-angle"
                    className="px-1 block w-auto"
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
                </FormItem>
              </section>
            </CardContent>
          </Card>

          <Card className="p-1 mb-2">
            <CardHeader className="p-1">
              <CardTitle className="text-md">Outer Angle</CardTitle>
            </CardHeader>
            <CardContent className="p-1">
              <section className="flex">
                <FormItem className="flex flex-row items-baseline">
                  <Input
                    type="number"
                    id="light-outer-angle"
                    className="px-1 block w-auto"
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
                </FormItem>
              </section>
            </CardContent>
          </Card>

          <Button>Update Spotlight</Button>
        </form>
      </CardContent>
    </Card>
  );
}
