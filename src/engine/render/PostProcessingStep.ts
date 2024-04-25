import { vec2 } from 'gl-matrix';
import { FrameBuffer } from '@/engine/render/gl/FrameBuffer';
import { Shader } from '@/engine/render/gl/Shader';
import { WebGL } from '@/engine/render/gl/WebGL';
import { Geometry } from './geometry/Geometry';
import { QuadGeometry } from './geometry/QuadGeometry';

const fragment = (id: number, frag: string) => `#version 300 es

precision mediump float;

in vec2 v_uv;
uniform sampler2D u_texture;
uniform vec2 u_screensize;

layout(location=${id}) out vec4 outColor;

${frag}`;
const vertex = (code?: string) => `#version 300 es

layout(location=0) in vec4 a_position;
layout(location=1) in vec2 a_uv;

out vec2 v_uv;

${
  code ??
  `void main() {
  gl_Position = a_position;
  v_uv = a_uv;
}`
}`;

export class PostProccessStep {
  private webgl: WebGL;
  private fbo: FrameBuffer;
  private quad: Geometry;
  private shader?: Shader;
  private size: vec2;

  private texId: number;
  private code: string;

  public name: string;
  public description: string = '';
  public enabled = false;

  constructor(
    webgl: WebGL,
    texId: number,
    code: string,
    name: string,
    screenSize: vec2,
    offset: number,
    description?: string,
  ) {
    this.texId = texId;
    this.code = code;
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
    if (!this.shader) {
      try {
        this.shader = this.compileShader();
      } catch (e) {
        return;
      }
    }
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

  private compileShader() {
    return this.webgl.createShader(
      this.name,
      vertex(),
      fragment(this.texId, this.code),
    );
  }
}
