import { vec2 } from 'gl-matrix';
import { WebGL } from '@/engine/render/gl/WebGL';
import { Mesh } from './Mesh';
import { QuadGeometry } from '@/engine/render/geometry/QuadGeometry';
import { Material } from '@/engine/render/material/Material';
import { Transform } from '@/engine/math/Transform';
import { AssetManager } from '@/engine/assets/AssetManager';

export class GridMesh extends Mesh {
  private _darkMode: boolean = false;
  public transform = new Transform();

  constructor(webgl: WebGL, assetManager: AssetManager, size: vec2) {
    super(
      'grid',
      new QuadGeometry(webgl, 'grid'),
      new Material(assetManager, 'grid', 'grid'),
    );
    if (!this.material)
      throw new Error(`could not successfully create GridMesh material`);
    this.material.cullFace = false;
    this.transform.rotation = [-Math.PI / 2, 0, 0];
    this.transform.scale = [size[0], size[1], 1];
    this.material.uniform('u_resolution', { type: 'vec2', value: size });
    this.material.uniform('u_dark_mode', {
      type: 'boolean',
      value: this._darkMode,
    });
  }

  public set darkMode(d: boolean) {
    this._darkMode = d;
    this.material?.uniform('u_dark_mode', {
      type: 'boolean',
      value: this._darkMode,
    });
  }

  public get darkMode(): boolean {
    return this._darkMode;
  }
}
