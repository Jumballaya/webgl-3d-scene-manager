import { Shader } from '../render/gl/Shader';
import { Texture } from '../render/gl/Texture';
import { WebGL } from '../render/gl/WebGL';
import { Loader } from './Loader';
import { Mesh } from '../render/mesh/Mesh';
import { Geometry } from '../render/geometry/Geometry';
import { QuadGeometry } from '../render/geometry/QuadGeometry';
import { Material } from '../render/material/Material';
import { ScriptManager } from '../scripting/ScriptManager';
import type { LoaderEntry } from './assets.types';

export class AssetManager {
  private textures: Map<string, Texture> = new Map();
  private geometries: Map<string, Geometry> = new Map();
  private materials: Map<string, Material> = new Map();
  private shaders: Map<string, Shader> = new Map();
  private meshes: Map<string, Mesh> = new Map();
  private loader: Loader;
  private scriptManager: ScriptManager;

  constructor(webgl: WebGL, scriptManager: ScriptManager) {
    this.loader = new Loader(webgl);
    this.geometries.set('quad', new QuadGeometry(webgl, 'quad'));
    this.scriptManager = scriptManager;
  }

  public get meshList(): string[] {
    return Array.from(this.meshes.keys());
  }

  public get textureList(): string[] {
    return Array.from(this.textures.keys());
  }

  public get geometryList(): string[] {
    return Array.from(this.geometries.keys());
  }

  public get shaderList(): string[] {
    return Array.from(this.shaders.keys());
  }

  public get materialList(): string[] {
    return Array.from(this.materials.keys());
  }

  public get scriptList(): string[] {
    return this.scriptManager.scriptList();
  }

  public async load(items: LoaderEntry[]) {
    const out = await this.loader.load(items, this);
    for (const [name, texture] of Object.entries(out.textures)) {
      this.textures.set(name, texture);
    }
    for (const [name, mesh] of Object.entries(out.meshes)) {
      this.meshes.set(name, mesh);
      if (mesh.geometry) {
        this.geometries.set(name, mesh.geometry);
      }
      if (mesh.material) {
        this.materials.set(name, mesh.material);
      }
    }
    for (const [name, material] of Object.entries(out.materials)) {
      this.materials.set(name, material);
    }
    for (const [name, geometry] of Object.entries(out.geometries)) {
      this.geometries.set(name, geometry);
    }
    for (const [name, shader] of Object.entries(out.shaders)) {
      this.shaders.set(name, shader);
    }
    for (const [name, text] of Object.entries(out.scripts)) {
      this.scriptManager.addScript(name, text);
    }
  }

  public addMesh(name: string, mesh: Mesh) {
    this.meshes.set(name, mesh);
  }

  public getMesh(name: string): Mesh | null {
    return this.meshes.get(name) ?? null;
  }

  public addTexture(name: string, texture: Texture) {
    this.textures.set(name, texture);
  }

  public getTexture(name: string): Texture | null {
    return this.textures.get(name) ?? null;
  }

  public addGeometry(name: string, geometries: Geometry) {
    this.geometries.set(name, geometries);
  }

  public getGeometry(name: string): Geometry | null {
    return this.geometries.get(name) ?? null;
  }

  public addMaterial(name: string, material: Material) {
    this.materials.set(name, material);
  }

  public getMaterial(name: string): Material | null {
    return this.materials.get(name) ?? null;
  }

  public addShader(name: string, shader: Shader) {
    this.shaders.set(name, shader);
  }

  public getShader(name: string): Shader | null {
    return this.shaders.get(name) ?? null;
  }

  public addScript(name: string, content: string) {
    this.scriptManager.addScript(name, content);
  }

  public getScript<T extends Array<unknown>>(name: string) {
    return this.scriptManager.getScript<T>(name);
  }
}
