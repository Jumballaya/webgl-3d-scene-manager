import { vec3 } from 'gl-matrix';
import { UBO } from '../gl/UBO';
import { WebGL } from '../gl/WebGL';
import { DrawMode } from '../gl/types/configs';
import { Geometry } from '../geometry/Geometry';
import { Material } from '../material/Material';
import { Uniform } from '../gl/types/uniforms.type';
import { numbers_equal } from '../../math/utils';
import { PhongMaterial } from '../material/PhongMaterial';
import { LitMaterial } from '../material/LitMaterial';
import { Transform } from '../../math/Transform';
const materialUboMaterials = [PhongMaterial, LitMaterial];

let count = 0;
function next_id(): vec3 {
  const r = (count >> 16) & 0xff;
  const g = (count >> 8) & 0xff;
  const b = count & 0xff;
  count += 1;
  return [r / 256, g / 256, b / 256];
}

export class Mesh {
  public name: string;
  private hoverId: vec3;
  private _isHovered = false;

  public geometry?: Geometry;
  public material?: Material;

  private _drawMode: DrawMode = 'triangles';

  constructor(name: string, geometry?: Geometry, material?: Material) {
    this.geometry = geometry;
    this.material = material;
    this.hoverId = next_id();
    this.name = name;
  }

  public clone(): Mesh {
    const geo = this.geometry?.clone();
    const mat = this.material?.clone();
    const mesh = new Mesh(this.name, geo, mat);
    return mesh;
  }

  public copy(m: Mesh, props: 'geometry' | 'material' | 'both' = 'both') {
    const clone = m.clone();
    if (props === 'material' || props === 'both') {
      this.material = clone.material;
    }
    if (props === 'geometry' || props === 'both') {
      this.geometry = clone.geometry;
    }
  }

  public isHoverId(id: vec3): boolean {
    return (
      numbers_equal(this.hoverId[0], id[0]) &&
      numbers_equal(this.hoverId[1], id[1]) &&
      numbers_equal(this.hoverId[2], id[2])
    );
  }

  public uniform(name: string, uniform: Uniform) {
    this.material?.uniform(name, uniform);
  }

  public get drawMode(): DrawMode {
    return this._drawMode;
  }

  public set drawMode(m: DrawMode) {
    this._drawMode = m;
  }

  public draw(
    webgl: WebGL,
    modelUbo: UBO,
    materialUBO: UBO,
    transform: Transform,
    overrideMaterial?: Material,
  ) {
    if (!this.geometry || !this.material) return;
    this.geometry.bind();

    if (this.needsToBindMaterialUbo()) {
      this.material.bindUbo(materialUBO);
    }

    if (overrideMaterial !== undefined) {
      overrideMaterial.bind();
    } else {
      this.material.bind();
    }

    modelUbo.bind();
    modelUbo.set('matrix', transform.matrix);
    modelUbo.set('inv_trans_matrix', transform.invTrans);
    modelUbo.set('id', [this.hoverId[0], this.hoverId[1], this.hoverId[2], 0]);

    if (this.material.cullFace) {
      webgl.enable('cull_face');
    } else {
      webgl.disable('cull_face');
    }

    webgl.drawArrays(this.geometry.vertexCount, this._drawMode);
    this.geometry.unbind();
    this.material.unbind();
    modelUbo.unbind();
  }

  public get isHovered(): boolean {
    return this._isHovered;
  }

  public set isHovered(ih: boolean) {
    this._isHovered = ih;
  }

  private needsToBindMaterialUbo(): boolean {
    return materialUboMaterials.some((c) => this.material instanceof c);
  }
}
