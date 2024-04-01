import useModelViewerCore from '@/core/useModelViewerCore';
import { AddRenderComponent } from './AddRenderComponent';
import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/ui/card';
import { Label } from '@/shadcn/ui/label';
import { Button } from '@/shadcn/ui/button';
import { PointLight } from '@/renderer/viewer/light/PointLight';
import { SpotLight } from '@/renderer/viewer/light/SpotLight';
import { Light } from '@/renderer/viewer/light/Light';
import { Mesh } from '@/renderer/viewer/Mesh';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shadcn/ui/select';
import { useState } from 'react';
import { SpotLightDetails } from './SpotLightDetails';

function getLightDetailsComponent(light: Light) {
  if (light instanceof PointLight) {
    return <></>;
  }
  if (light instanceof SpotLight) {
    return <SpotLightDetails light={light} />;
  }
  return <></>;
}

export function LightDetails() {
  const mvc = useModelViewerCore();
  const currentlySelected = mvc.getCurrentlySelected();
  const lightComp = currentlySelected?.getComponent<Light>('Light');
  const meshComp = currentlySelected?.getComponent<Mesh>('Mesh');
  const [lightType, setLightType] = useState<'point' | 'spot'>(
    lightComp?.data.type || 'point',
  );
  if (!currentlySelected) {
    return <></>;
  }
  if (meshComp) {
    return <></>;
  }

  if (!lightComp) {
    return <AddRenderComponent />;
  }

  return (
    <Card className="p-1 my-4">
      <CardHeader className="p-3 pb-0">
        <CardTitle>
          <Label htmlFor="rotation-x" className="mr-2 text-xl">
            Light
          </Label>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <Select
          onValueChange={(type) => {
            if (type === 'point') {
              mvc.removeLight(lightComp.data);
              const light = mvc.createLight(type);
              if (light) {
                mvc.updateComponentOnCurrentlySelected('Light', light);
                setLightType(type);
              }
            }
            if (type === 'spot') {
              mvc.removeLight(lightComp.data);
              const light = mvc.createLight(type);
              if (light) {
                mvc.updateComponentOnCurrentlySelected('Light', light);
                setLightType(type);
              }
            }
          }}
          value={lightType}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a material" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="point">Point Light</SelectItem>
              <SelectItem value="spot">Spot Light</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        {getLightDetailsComponent(lightComp.data)}
        <Button
          className="mt-2"
          onClick={(e) => {
            e.preventDefault();
            mvc.removeComponentFromCurrentlySelected('Light');
            mvc.removeLight(lightComp.data);
          }}
          variant={'destructive'}
        >
          Remove
        </Button>
      </CardContent>
    </Card>
  );
}
