import useModelViewerCore from '@/core/useModelViewerCore';
import { Input } from '@/shadcn/ui/input';
import { useEntityStore } from '@/store/entityStore';
import { ComponentDetail } from './component-details/ComponentDetail';

function NameDetails() {
  const { currentlySelected } = useEntityStore();
  const mvc = useModelViewerCore();
  const nameComp = currentlySelected?.components.filter(
    (c) => c[0] === 'Name',
  )[0];
  if (!nameComp) {
    return <></>;
  }
  return (
    <ComponentDetail title="Name">
      <Input
        type="text"
        id="rotation-x"
        className="m-0 px-2 py-1 h-auto"
        value={(nameComp[1] as string) || ''}
        onChange={(e) => {
          mvc.updateComponentOnCurrentlySelected('Name', e.target.value);
        }}
      />
    </ComponentDetail>
  );
}

export default NameDetails;
