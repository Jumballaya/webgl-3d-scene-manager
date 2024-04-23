import useModelViewerCore from '@/core/useModelViewerCore';
import { Button } from '@/shadcn/ui/button';

export function PrefabDetails(props: { prefabName: string }) {
  const mvc = useModelViewerCore();

  return (
    <Button
      onClick={() => {
        mvc.spawnPrefab(props.prefabName);
      }}
    >
      Spawn
    </Button>
  );
}
