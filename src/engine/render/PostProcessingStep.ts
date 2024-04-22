import { vec2 } from 'gl-matrix';
import { FrameBuffer } from '@/engine/render/gl/FrameBuffer';
import { Shader } from '@/engine/render/gl/Shader';
import { WebGL } from '@/engine/render/gl/WebGL';
import { Geometry } from './geometry/Geometry';
import { QuadGeometry } from './geometry/QuadGeometry';

export class PostProccessStep {
  private webgl: WebGL;
  private fbo: FrameBuffer;
  private quad: Geometry;
  private shader: Shader;
  private size: vec2;

  public name: string;
  public description: string = '';
  public enabled = true;

  constructor(
    webgl: WebGL,
    shader: Shader,
    name: string,
    screenSize: vec2,
    offset: number,
    description?: string,
  ) {
    this.shader = shader;
    this.quad = new QuadGeometry(webgl, 'quad');
    this.webgl = webgl;
    this.fbo = webgl.createFrameBuffer(offset);
    this.fbo.attachment({
      type: 'color',
      size: screenSize,
    });
    this.fbo.attachment({
      type: 'depth',
      size: screenSize,
    });
    webgl.drawBuffers(this.fbo.getDrawBuffers());
    this.fbo.unbind();
    this.size = screenSize;
    this.name = name;
    this.description = description ?? '';
  }

  public draw(textureToProcess: number) {
    this.fbo.bind();
    this.webgl.viewport(0, 0, this.size);
    this.webgl.clear('color', 'depth');

    this.shader.bind();
    this.quad.bind();
    this.shader.uniform('u_texture', {
      type: 'texture',
      value: textureToProcess,
    });

    try {
      this.shader.uniform('u_screensize', { type: 'vec2', value: this.size });
    } catch (_) {
      console.log('screensize not set up');
    }
    this.webgl.drawArrays(this.quad.vertexCount, 'triangles');
    this.quad.unbind();
    this.shader.unbind();
    this.fbo.unbind();
  }
}
