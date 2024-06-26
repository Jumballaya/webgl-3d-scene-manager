import { vec2, vec3 } from 'gl-matrix';
import { Shader } from './Shader';
import { Texture } from './Texture';
import { VertexArray } from './VertexArray';
import { VertexBuffer } from './VertexBuffer';
import {
  DrawMode,
  TextureConfig,
  UBOConfig,
  VertexArrayConfig,
  VertexBufferConfig,
} from './types/configs';
import { Controller } from '@/engine/controls/Controller';
import { UBO } from './UBO';
import { loadImage } from '@/engine/assets/loaders';
import { Surface } from './Surface';
import { FrameBuffer } from './FrameBuffer';

type EnableOption = 'cull_face' | 'depth' | 'blend' | 'multisample';
type ClearOption = 'color' | 'depth';

function getDrawMode(m: DrawMode): number {
  const gl = WebGL2RenderingContext;
  switch (m) {
    case 'lines':
      return gl.LINES;
    case 'points':
      return gl.POINTS;
    case 'triangles':
      return gl.TRIANGLES;
  }
}

export class WebGL {
  private context: WebGL2RenderingContext;
  private isFullScreen: boolean = false;

  constructor(context: WebGL2RenderingContext) {
    this.context = context;

    window.addEventListener('resize', () => {
      if (this.fullScreen) {
        this.context.canvas.width = window.innerWidth;
        this.context.canvas.height = window.innerHeight;
      }
    });
  }

  public set fullScreen(fs: boolean) {
    this.isFullScreen = fs;
    this.context.canvas.width = window.innerWidth;
    this.context.canvas.height = window.innerHeight;
  }

  public get fullScreen(): boolean {
    return this.isFullScreen;
  }

  public registerController(controller: Controller) {
    controller.registerForCanvas(this.context.canvas as HTMLCanvasElement);
  }

  public clear(...opts: ClearOption[]) {
    let mask = 0;
    for (const opt of opts) {
      switch (opt) {
        case 'color': {
          mask |= this.context.COLOR_BUFFER_BIT;
          break;
        }
        case 'depth': {
          mask |= this.context.DEPTH_BUFFER_BIT;
          break;
        }
      }
    }
    if (mask !== 0) {
      this.context.clear(mask);
    }
  }

  public enable(...opts: EnableOption[]) {
    for (const opt of opts) {
      switch (opt) {
        case 'cull_face': {
          this.context.enable(this.context.CULL_FACE);
          break;
        }
        case 'depth': {
          this.context.enable(this.context.DEPTH_TEST);
          break;
        }
        case 'blend': {
          this.context.enable(this.context.BLEND);
          break;
        }
        case 'multisample': {
          this.context.enable(this.context.SAMPLE_COVERAGE);
          this.context.sampleCoverage(0.5, false);
          break;
        }
      }
    }
  }

  public disable(...opts: EnableOption[]) {
    for (const opt of opts) {
      switch (opt) {
        case 'cull_face': {
          this.context.disable(this.context.CULL_FACE);
          break;
        }
        case 'depth': {
          this.context.disable(this.context.DEPTH_TEST);
          break;
        }
        case 'blend': {
          this.context.disable(this.context.BLEND);
          break;
        }
        case 'multisample': {
          this.context.disable(this.context.SAMPLE_COVERAGE);
          break;
        }
      }
    }
  }

  public readPixels(
    x: number,
    y: number,
    w: number,
    h: number,
    format: number,
    type: number,
    data: Uint8ClampedArray,
  ) {
    this.context.readPixels(x, y, w, h, format, type, data);
  }

  public clearColor(c: vec3, a = 1) {
    this.context.clearColor(c[0], c[1], c[2], a);
  }

  public viewport(x: number, y: number, size: vec2) {
    this.context.viewport(x, y, size[0], size[1]);
  }

  public blendFunc(sfactor: number, dfactor: number) {
    this.context.blendFunc(sfactor, dfactor);
  }

  public drawArrays(count: number, drawMode: DrawMode) {
    const mode = getDrawMode(drawMode);
    this.context.drawArrays(mode, 0, count);
  }

  public drawBuffers(buffers: number[]) {
    this.context.drawBuffers(buffers);
  }

  public createShader(name: string, vertex: string, fragment: string): Shader {
    const shader = new Shader(this.context, name, vertex, fragment);
    return shader;
  }

  public createVertexBuffer(config: VertexBufferConfig): VertexBuffer {
    return new VertexBuffer(this.context, config);
  }

  public createVertexArray(config: VertexArrayConfig): VertexArray {
    return new VertexArray(this.context, config);
  }

  public createTexture(
    image: HTMLImageElement | vec2,
    cfg?: TextureConfig,
  ): Texture {
    const tex = new Texture(this.context, image, cfg);
    return tex;
  }

  public createSurface(shader: Shader, size: vec2, hasDepth = false) {
    return new Surface(this.context, size, shader, hasDepth);
  }

  public async loadTexture(path: string): Promise<Texture> {
    const img = await loadImage(path);
    return this.createTexture(img);
  }

  public createUBO(name: string, config: UBOConfig | Float32Array): UBO {
    return new UBO(this.context, name, config);
  }

  public createFrameBuffer(texOffset = 0) {
    return new FrameBuffer(this.context, texOffset);
  }
}
