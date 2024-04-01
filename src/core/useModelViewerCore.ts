import { useMemo } from 'react';
import { ModelViewerCore } from './ModelViewerCore';
import { useEntityStore } from '@/store/entityStore';

const GLOBAL_MODEL_VIEWER_CORE = new ModelViewerCore();

export default function useModelViewerCore() {
  const entityStore = useEntityStore();
  const mvCore = useMemo<ModelViewerCore>(() => {
    GLOBAL_MODEL_VIEWER_CORE.setEntityStore(entityStore);
    return GLOBAL_MODEL_VIEWER_CORE;
  }, [entityStore]);
  return mvCore;
}
