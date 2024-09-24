import useModelViewerCore from '@/core/useModelViewerCore';
import { PointLight } from '@/engine/render/light/PointLight';
import { SpotLight } from '@/engine/render/light/SpotLight';
import { Light } from '@/engine/render/light/Light';
import { useState } from 'react';
import { SpotLightDetails } from './SpotLightDetails';
import { ComponentDetail } from './component-details/ComponentDetail';
import { DropdownSelect } from '@/components/DropdownSelect';

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
  const [lightType, setLightType] = useState<'point' | 'spot'>(
    lightComp?.data.type || 'point',
  );
  if (!currentlySelected || !lightComp) {
    return <></>;
  }
  return (
    <ComponentDetail
      onDestroy={() => {
        mvc.removeComponentFromCurrentlySelected('Light');
        mvc.removeLight(lightComp.data);
      }}
      title="Light"
    >
      <h3 className="mb-1">Light Type</h3>
      <DropdownSelect
        name="entity_details_light_type"
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
        options={[
          { value: 'point', display: 'Point Light' },
          { value: 'spot', display: 'Spot Light' },
        ]}
        placeholder="Select a Geometry"
      />
      {getLightDetailsComponent(lightComp.data)}
    </ComponentDetail>
  );
}
