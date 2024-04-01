import { useCallback, useEffect, useState } from 'react';
import Canvas from './Canvas';

import { useEntityStore } from '@/store/entityStore';
import useModelViewerCore from '@/core/useModelViewerCore';
import { useTheme } from '@/core/theme';

const CanvasViewer = () => {
  const mvc = useModelViewerCore();
  const entityStore = useEntityStore();
  const { theme } = useTheme();
  const [drawer] = useState<(ctx: WebGL2RenderingContext, dt: number) => void>(
    mvc.draw.bind(mvc),
  );

  const initialize = useCallback(async (context: WebGL2RenderingContext) => {
    await mvc.initialize(context).catch((e) => console.log(e));
    mvc.setEntityStore(entityStore);
    if (theme === 'dark') {
      mvc.darkMode = true;
    } else {
      mvc.darkMode = false;
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      mvc.darkMode = true;
    } else {
      mvc.darkMode = false;
    }
  }, [theme]);

  return (
    <div>
      <Canvas
        className="border mx-auto"
        width={1024}
        height={768}
        draw={drawer}
        initialize={initialize}
      />
    </div>
  );
};

export default CanvasViewer;
