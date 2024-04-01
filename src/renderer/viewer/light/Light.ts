import { vec3 } from 'gl-matrix';
import { LightManager } from './LightManager';
import { LightTypes } from './types/light-types.type';
import { WebGL } from '../../gl/WebGL';

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
    return this._position;
  }

  public set position(p: vec3) {
    this._position[0] = p[0];
    this._position[1] = p[1];
    this._position[2] = p[2];
    this.manager.updateLight(this);
  }

  public clone(): Light {
    const light = new Light(this.manager, this.type, this.webgl);
    light._position = this._position;
    light.active = this.active;
    return light;
  }
}
