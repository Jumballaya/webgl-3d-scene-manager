import { useCallback, useEffect, useState } from 'react';
import Canvas from './Canvas';

import { useEntityStore } from '@/store/entityStore';
import useModelViewerCore from '@/core/useModelViewerCore';
import { useTheme } from '@/core/theme';

const CanvasViewer = () => {
  const mvc = useModelViewerCore();
  const entityStore = useEntityStore();
  const { theme } = useTheme();
  const [drawer] = useState(() => mvc.render.bind(mvc));

  const initialize = useCallback(
    async (context: WebGL2RenderingContext) => {
      await mvc.initialize(context).catch((e) => console.log(e));
      mvc.setEntityStore(entityStore);
      if (theme === 'dark') {
        mvc.darkMode = true;
      } else {
        mvc.darkMode = false;
      }
    },
    [mvc],
  );

  useEffect(() => {
    if (theme === 'dark') {
      mvc.darkMode = true;
    } else {
      mvc.darkMode = false;
    }
  }, [theme, mvc]);

  return (
    <div>
      <Canvas
        className="border mx-auto"
        width={800}
        height={600}
        draw={drawer}
        initialize={initialize}
      />
    </div>
  );
};

export default CanvasViewer;
