import NameDetails from './NameDetails';
import TransformDetails from './TransformDetails';
import { EntityActions } from './EntityActions';
import { ScriptsDetails } from './ScriptsDetails';
import { LightDetails } from './LightDetails';
import MeshDetails from './MeshDetails';

export default function EntityDetails() {
  return (
    <div className="w-full">
      <EntityActions />
      <NameDetails />
      <TransformDetails />
      <LightDetails />
      <MeshDetails />
      <ScriptsDetails />
    </div>
  );
}
