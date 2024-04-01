import { useEffect, useRef, useState } from 'react';

type CanvasProps = {
  width: number;
  height: number;
  className: string;
  draw: ((ctx: WebGL2RenderingContext, dt: number) => void) | null;
  initialize: (ctx: WebGL2RenderingContext) => void;
  onClick?: () => void;
};

const Canvas = (props: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [context, setContext] = useState<WebGL2RenderingContext | null>(null);
  const { draw, initialize, width, height } = props;

  useEffect(() => {
    if (canvasRef.current && initialize) {
      const canvas = canvasRef.current;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('webgl2');
      if (!context && ctx) {
        setContext(ctx);
        initialize(ctx);
      }
    }
  }, [initialize, width, height, context]);

  useEffect(() => {
    let frameCount = 0;
    let animationFrameId: number;

    if (context) {
      const render = () => {
        frameCount++;
        draw?.(context, frameCount);
        animationFrameId = window.requestAnimationFrame(render);
      };
      render();
    }
    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  });

  return (
    <canvas
      ref={canvasRef}
      className={props.className ?? ''}
      onClick={props.onClick}
    ></canvas>
  );
};

export default Canvas;
