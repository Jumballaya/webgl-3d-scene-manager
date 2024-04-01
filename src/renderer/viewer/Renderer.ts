import { WebGL } from '../gl/WebGL';
import { mat4, vec3 } from 'gl-matrix';
import { Camera } from './Camera';
import { UBO } from '../gl/UBO';
import { Surface } from '../gl/Surface';
import { LightManager } from './light/LightManager';
import { Mesh } from './Mesh';
import { GridMesh } from './GridMesh';
import { Entity } from './ecs/Entity';
import { Transform } from '../math/Transform';
import { AssetManager } from '../assets/AssetManager';
import { Light } from './light/Light';
import { LightTypes } from './light/types/light-types.type';

/**
 *    Render pipeline:
 *
 *      { renderCalls, renderOptions } -> (renderStep: [ surface ])-> { renderCalls, renderOptions } -> etc.
 *
 *
 *      Chainable modules that:
 *          1. Has a surface to draw to
 *          2. Has a set of draw calls
 *          3. Has draw options and outputs set up
 *          4. Has renderer and scene options for clearing/enable/disable/transparency/etc.
 *          5. Has nothing to do with the ECS
 *          6. Chain together to create the G-buffer
 *
 *
 *          stage 1: Draw Objects
 *              Input  -> Objects to draw
 *              Output -> Color, position and normals [, emissive, specular]
 *
 *          stage 2: Light
 *              Input  -> Textures from step 1 and light data
 *              Output -> Lit scene
 *
 *          stage [3 - infinite]: Post Processing
 *              Input  -> Lit scene from step 2
 *              Output -> Processed image
 *
 *
 *        Users can create PostProcessing steps and register/enable/disable them
 *
 *        Built in PostProcessing:
 *          - Bloom
 *          - MSAA
 *
 */

// @TODO:
//        re-create hover functionality elsewhere
//        extract grid floor out
//        remove any ECS stuff (entity references) out to the MeshRenderSystem
//              -- meaning: renderer should accept a list of render calls
//
export class Renderer {
  private webgl: WebGL;
  private camera: Camera;
  private modelUBO: UBO;
  private materialUBO: UBO;

  private screen: Surface;
  private clearColor: vec3 = [1, 1, 1];
  private _darkMode = false;
  private gridFloor: GridMesh;
  private lightManager: LightManager;
  private assetManager: AssetManager;

  public showGrid = true;

  constructor(webgl: WebGL, camera: Camera, assetManager: AssetManager) {
    this.camera = camera;
    this.webgl = webgl;
    this.assetManager = assetManager;
    webgl.enable('depth', 'cull_face', 'blend');
    webgl.blendFunc(
      WebGL2RenderingContext.SRC_ALPHA,
      WebGL2RenderingContext.ONE_MINUS_SRC_ALPHA,
    );
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
    this.lightManager = new LightManager(webgl);
    this.setupUbos({
      model: ['lights', 'grid'],
      material: ['lights'],
      camera: ['lights', 'screen', 'grid'],
      lights: ['lights'],
    });

    const screenShader = this.assetManager.getShader('screen')!; // @TODO: better guards for this call
    this.screen = webgl.createSurface(
      screenShader,
      this.camera.screenSize,
      true,
    );
    this.screen.disable();

    this.backgroundColor = [0.92, 0.92, 0.92];
    this.gridFloor = new GridMesh(webgl, assetManager, [30, 30]);
  }

  public get backgroundColor(): vec3 {
    return this.clearColor;
  }

  public set backgroundColor(c: vec3) {
    this.webgl.clearColor(c);
    this.screen.clearColor = [c[0], c[1], c[2], 1];
    this.clearColor[0] = c[0];
    this.clearColor[1] = c[1];
    this.clearColor[2] = c[2];
  }

  public set darkMode(m: boolean) {
    this._darkMode = m;
    this.gridFloor.uniform('u_dark_mode', {
      type: 'boolean',
      value: this._darkMode,
    });
    if (this._darkMode) {
      this.backgroundColor = [0.05, 0.05, 0.05];
    } else {
      this.backgroundColor = [0.92, 0.92, 0.92];
    }
  }

  public render(entities: Entity[]) {
    this.webgl.clear('color', 'depth');
    this.webgl.viewport(0, 0, this.camera.screenSize);
    this.camera.update();
    this.screen.enable();
    const seen = new Set<number>();

    // Render System
    for (const ent of entities) {
      this.renderEntity(ent, seen);
    }

    if (this.showGrid) {
      this.gridFloor.draw(
        this.webgl,
        this.modelUBO,
        this.materialUBO,
        this.gridFloor.transform,
      );
    }
    this.screen.disable();
    this.screen.draw(this.camera.ubo);
  }

  public createLight<T extends keyof LightTypes>(type: T): LightTypes[T] {
    const l = this.lightManager.createLight(type);
    return l as LightTypes[T];
  }

  public removeLight(light: Light) {
    this.lightManager.removeLight(light);
  }

  private renderEntity(ent: Entity, seen: Set<number>, transform?: Transform) {
    if (seen.has(ent.id)) return;
    seen.add(ent.id);
    const meshComp = ent.getComponent<Mesh>('Mesh');
    const transComp = ent.getComponent<Transform>('Transform');
    const appliedTransform = transComp?.data?.clone() ?? new Transform();
    if (transform) {
      appliedTransform.add(transform);
    }
    if (meshComp && transComp) {
      meshComp.data.draw(
        this.webgl,
        this.modelUBO,
        this.materialUBO,
        appliedTransform,
      );
    }

    for (const child of ent.children) {
      this.renderEntity(child, seen, appliedTransform);
    }
  }

  private setupUbos(config: {
    model: string[];
    material: string[];
    camera: string[];
    lights: string[];
  }) {
    this.modelUBO.bind();
    this.modelUBO.set('matrix', mat4.create());
    for (const shader of config.model) {
      const shad = this.assetManager.getShader(shader);
      if (shad) {
        this.modelUBO.setupShader(shad);
      }
    }
    this.modelUBO.unbind();

    this.materialUBO.bind();
    for (const shader of config.material) {
      const shad = this.assetManager.getShader(shader);
      if (shad) {
        this.materialUBO.setupShader(shad);
      }
    }
    this.materialUBO.unbind();

    this.camera.setupUBO(
      config.camera.map((s) => this.assetManager.getShader(s)!),
    );
    this.lightManager.registerShaders(
      config.lights.map((s) => this.assetManager.getShader(s)!),
    );
  }
}
