import { WebGL } from '@/engine/render/gl/WebGL';
import { Geometry } from './Geometry';

const buffers = [
  {
    stride: 3,
    name: 'a_position',
    type: WebGL2RenderingContext.FLOAT,
    normalized: false,
    data: new Float32Array([
      -1, -1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, 1, 1, 0, -1, 1, 0,
    ]),
    drawType: WebGL2RenderingContext.STATIC_DRAW,
  },
  {
    stride: 2,
    name: 'a_uv',
    type: WebGL2RenderingContext.FLOAT,
    normalized: false,
    data: new Float32Array([0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1]),
  },
  {
    stride: 3,
    name: 'a_normal',
    type: WebGL2RenderingContext.FLOAT,
    normalized: false,
    data: new Float32Array([
      0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
    ]),
  },
];

export class QuadGeometry extends Geometry {
  protected webgl: WebGL;

  constructor(webgl: WebGL, name = 'quad') {
    super(
      webgl.createVertexArray({
        drawType: WebGL2RenderingContext.STATIC_DRAW,
        buffers,
      }),
      name,
    );
    this.webgl = webgl;
  }
}
