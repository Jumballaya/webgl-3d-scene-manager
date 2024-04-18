import { useEffect, useState } from 'react';
import { useEntityStore } from '@/store/entityStore';
import useModelViewerCore from '@/core/useModelViewerCore';
import { useTheme } from '@/core/theme';

const CanvasViewer = () => {
  const mvc = useModelViewerCore();
  const entityStore = useEntityStore();
  const { theme } = useTheme();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    mvc
      .initialize()
      .catch((e) => console.log(e))
      .then(() => {
        mvc.setEntityStore(entityStore);
        setInitialized(true);

        let animationFrameId: number;
        const render = () => {
          mvc.render();
          animationFrameId = requestAnimationFrame(render);
        };
        render();
        return () => {
          window.cancelAnimationFrame(animationFrameId);
        };
      });
  }, [mvc, entityStore]);

  useEffect(() => {
    if (theme === 'dark') {
      mvc.darkMode = true;
    } else {
      mvc.darkMode = false;
    }
  }, [theme, mvc]);

  return initialized ? (
    <div ref={(ref) => ref?.appendChild(mvc.element)}></div>
  ) : (
    <></>
  );
};

export default CanvasViewer;
