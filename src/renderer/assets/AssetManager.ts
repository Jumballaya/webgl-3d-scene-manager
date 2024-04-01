/**
 *      Assets:
 *
 *        - Textures
 *        - Geometries
 *        - Materials
 *        - Shaders
 *
 */

import { Shader } from '../gl/Shader';
import { Texture } from '../gl/Texture';
import { WebGL } from '../gl/WebGL';
import { Loader, LoaderEntry } from '../viewer/Loader';
import { Mesh } from '../viewer/Mesh';
import { Geometry } from '../viewer/geometry/Geometry';
import { QuadGeometry } from '../viewer/geometry/QuadGeometry';
import { Material } from '../viewer/material/Material';

export class AssetManager {
  private textures: Map<string, Texture> = new Map();
  private geometries: Map<string, Geometry> = new Map();
  private materials: Map<string, Material> = new Map();
  private shaders: Map<string, Shader> = new Map();
  private meshes: Map<string, Mesh> = new Map();
  private loader: Loader;

  constructor(webgl: WebGL) {
    this.loader = new Loader(webgl);
    this.geometries.set('quad', new QuadGeometry(webgl, 'quad'));
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

  public async load(items: LoaderEntry[]) {
    const out = await this.loader.load(items, this);
    for (const [name, texture] of Object.entries(out.textures)) {
      this.textures.set(name, texture);
    }
    for (const [name, mesh] of Object.entries(out.meshes)) {
      this.meshes.set(name, mesh);
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
}
