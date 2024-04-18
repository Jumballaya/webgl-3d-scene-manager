import { WebGL } from '../gl/WebGL';
import { Transform } from '../math/Transform';
import { QuadGeometry } from './geometry/QuadGeometry';
import { vec2, vec3 } from 'gl-matrix';
import { Geometry } from './geometry/Geometry';
import { UBO } from '../gl/UBO';
import { FrameBuffer } from '../gl/FrameBuffer';
import { Shader } from '../gl/Shader';
import { PostProccessStep } from './PostProcessingStep';
import { GridMesh } from './GridMesh';
import { AssetManager } from '../assets/AssetManager';
import { LightManager } from './light/LightManager';
import { LightTypes } from './light/types/light-types.type';
import { Light } from './light/Light';
import { Camera } from './Camera';
import { Material } from './material/Material';

type MeshRenderCall = {
  geometry: Geometry;
  transform: Transform;
  material: Material;
};

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

export class Renderer {
  private webgl: WebGL;
  private modelUBO: UBO;
  private materialUBO: UBO;
  private gBufferFBO: FrameBuffer;
  private lightFBO: FrameBuffer;

  private lightManager: LightManager;

  private size: vec2;
  private clearColor: vec3 = [1, 1, 1];
  private _darkMode = false;
  private gridFloor: GridMesh;

  private quadGeometry: QuadGeometry;
  private screenTrans = new Transform();
  private lightShader: Shader;
  private screenShader: Shader;
  private gBufferShader: Shader;

  private postProccessStack: PostProccessStep[] = [];
  private stack: MeshRenderCall[] = [];

  public showGrid = true;

  constructor(
    webgl: WebGL,
    size: vec2,
    lightShader: Shader,
    screenShader: Shader,
    gBufferShader: Shader,
    assetManager: AssetManager,
  ) {
    this.modelUBO = webgl.createUBO('Model', [
      { name: 'matrix', type: 'mat4' },
      { name: 'inv_trans_matrix', type: 'mat4' },
      { name: 'id', type: 'vec4' },
    ]);

    this.materialUBO = webgl.createUBO('Material', [
      { name: 'ambient', type: 'vec4' },
      { name: 'diffuse', type: 'vec4' },
      { name: 'specular', type: 'vec4' },
      { name: 'opacity', type: 'vec4' },
      { name: 'textures', type: 'vec4' },
    ]);
    this.materialUBO.bind();
    this.materialUBO.set('diffuse', [1, 0, 0, 1]);
    this.webgl = webgl;
    this.size = size;

    const fbo = webgl.createFrameBuffer();
    fbo.attachment({
      type: 'color',
      size,
    });
    fbo.attachment({
      type: 'color',
      size,
    });
    fbo.attachment({
      type: 'color',
      size,
    });
    fbo.attachment({
      type: 'depth',
      size,
    });
    webgl.drawBuffers(fbo.getDrawBuffers());
    fbo.unbind();
    this.gBufferFBO = fbo;

    this.lightFBO = webgl.createFrameBuffer(3);
    this.lightFBO.attachment({
      type: 'color',
      size,
    });
    webgl.drawBuffers(this.lightFBO.getDrawBuffers());
    this.lightFBO.unbind();

    this.quadGeometry = new QuadGeometry(webgl, 'quad');
    this.lightShader = lightShader;
    this.screenShader = screenShader;
    this.gBufferShader = gBufferShader;

    this.backgroundColor = [0.92, 0.92, 0.92];
    this.gridFloor = new GridMesh(webgl, assetManager, [1000, 1000]);
    this.lightManager = new LightManager(webgl);
  }

  public get backgroundColor(): vec3 {
    return this.clearColor;
  }

  public set backgroundColor(c: vec3) {
    this.webgl.clearColor(c);
    this.clearColor[0] = c[0];
    this.clearColor[1] = c[1];
    this.clearColor[2] = c[2];
  }

  public set darkMode(m: boolean) {
    this._darkMode = m;
    this.gridFloor.darkMode = m;
    if (this._darkMode) {
      this.backgroundColor = [0.05, 0.05, 0.05];
    } else {
      this.backgroundColor = [0.92, 0.92, 0.92];
    }
  }

  public setupUBO(setups: Record<'model' | 'material' | 'lights', Shader[]>) {
    this.materialUBO.bind();
    for (const shader of setups.material ?? []) {
      this.materialUBO.setupShader(shader);
    }
    this.materialUBO.unbind();

    this.modelUBO.bind();
    for (const shader of setups.model ?? []) {
      this.modelUBO.setupShader(shader);
    }
    this.modelUBO.unbind();

    if (setups.lights.length) {
      this.lightManager.registerShaders(setups.lights);
    }
  }

  public createLight<T extends keyof LightTypes>(type: T): LightTypes[T] {
    const l = this.lightManager.createLight(type);
    return l as LightTypes[T];
  }

  public removeLight(light: Light) {
    this.lightManager.removeLight(light);
  }

  public render(camera: Camera) {
    camera.update();
    this.gBufferStage();
    this.lightsStage();

    let texValue = 3;
    for (const postProcess of this.postProccessStack) {
      postProcess.draw(texValue);
      texValue++;
    }

    this.webgl.clear('color', 'depth');

    this.quadGeometry.bind();
    this.screenShader.bind();
    this.screenShader.uniform('u_texture', {
      type: 'texture',
      value: texValue,
    });
    this.webgl.drawArrays(this.quadGeometry.vertexCount, 'triangles');
    this.screenShader.unbind();
    this.quadGeometry.unbind();
  }

  public add(geometry: Geometry, transform: Transform, material: Material) {
    this.stack.push({
      geometry,
      transform,
      material,
    });
  }

  public createPostProcessStep(name: string, code: string) {
    const texId = 4 + this.postProccessStack.length;
    const step = new PostProccessStep(
      this.webgl,
      this.webgl.createShader(name, vertex(), fragment(texId, code)),
      this.size,
      texId,
    );
    this.postProccessStack.push(step);
  }

  private renderMesh(mesh: MeshRenderCall) {
    mesh.geometry.bind();
    mesh.material.bind();

    this.modelUBO.bind();
    this.modelUBO.set('matrix', mesh.transform.matrix);
    this.modelUBO.set('inv_trans_matrix', mesh.transform.invTrans);
    this.modelUBO.unbind();

    this.materialUBO.bind();
    this.materialUBO.set('textures', [0, 0, 0, 0]);
    this.materialUBO.unbind();

    if (mesh.material.cullFace) {
      this.webgl.enable('cull_face');
    } else {
      this.webgl.disable('cull_face');
    }

    this.webgl.drawArrays(mesh.geometry.vertexCount, 'triangles');
    mesh.geometry.unbind();
    this.gBufferShader.unbind();
  }

  private gBufferStage() {
    this.gBufferFBO.bind();
    this.webgl.clearColor(this.backgroundColor, 0);
    this.webgl.enable('blend');
    this.webgl.viewport(0, 0, this.size);
    this.webgl.clear('color', 'depth');

    while (this.stack.length) {
      const mesh = this.stack.pop();
      if (mesh) {
        this.renderMesh(mesh);
      }
    }

    if (this.showGrid) {
      this.renderMesh({
        transform: this.gridFloor.transform,
        geometry: this.gridFloor.geometry!,
        material: this.gridFloor.material!,
      });
    }

    this.gBufferFBO.unbind();
  }

  private lightsStage() {
    this.lightFBO.bind();
    this.webgl.clearColor(this.backgroundColor, 0);
    this.quadGeometry.bind();
    this.lightShader.bind();
    this.modelUBO.bind();
    this.modelUBO.set('matrix', this.screenTrans.matrix);
    this.modelUBO.set('inv_trans_matrix', this.screenTrans.invTrans);
    this.modelUBO.unbind();
    this.lightShader.uniform('u_texture_color', { type: 'texture', value: 0 });
    this.lightShader.uniform('u_texture_position', {
      type: 'texture',
      value: 1,
    });
    this.lightShader.uniform('u_texture_normal', { type: 'texture', value: 2 });
    this.webgl.drawArrays(this.quadGeometry.vertexCount, 'triangles');
    this.lightShader.unbind();
    this.quadGeometry.unbind();
    this.lightFBO.unbind();
  }
}
