import { vec3 } from 'gl-matrix';
import { LightManager } from './LightManager';
import { LightTypes } from './types/light-types.type';
import { WebGL } from '@/engine/render/gl/WebGL';

export class Light {
  protected manager: LightManager;
  private _position: vec3 = [0, 0, 0];
  public active = true;
  public type: keyof LightTypes;
  public id = 0;

  protected webgl: WebGL;

  constructor(manager: LightManager, type: keyof LightTypes, webgl: WebGL) {
    this.manager = manager;
    this.webgl = webgl;
    this.type = type;
  }

  public get position(): vec3 {
    return [this._position[0], this._position[1], this._position[2]];
  }

  public set position(p: vec3) {
    this._position[0] = p[0];
    this._position[1] = p[1];
    this._position[2] = p[2];
    this.manager.updateLight(this);
  }

  public clone(): Light {
    const light = this.manager.createLight(this.type);
    light._position = this.position;
    light.active = this.active;
    this.manager.updateLight(light);
    return light;
  }
}
