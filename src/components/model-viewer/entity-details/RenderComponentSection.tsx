import useModelViewerCore from '@/core/useModelViewerCore';
import { AddRenderComponent } from './AddRenderComponent';
import { LightDetails } from './light-details';
import MeshDetails from './mesh-details';

export function RenderComponentSection() {
  const mvc = useModelViewerCore();
  const currentlySelected = mvc.getCurrentlySelected();
  if (!currentlySelected) {
    return <></>;
  }

  const meshComp = currentlySelected.getComponent('Mesh');
  const lightComp = currentlySelected.getComponent('Light');
  if (meshComp) {
    return <MeshDetails />;
  }
  if (lightComp) {
    return <LightDetails />;
  }

  return <AddRenderComponent />;
}
