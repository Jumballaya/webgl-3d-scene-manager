import { vec3, vec4 } from 'gl-matrix';
import { UBO } from '../../gl/UBO';
import { Material } from './Material';
import { PhongMaterialConfig } from './types/phong-material-config.type';
import { AssetManager } from '@/renderer/assets/AssetManager';

type LitMaterialValues = {
  albedo?: string;
  normal_map?: string;
  specular_map?: string;
  ambient?: vec3;
  specular?: vec3;
  diffuse?: vec3;
  opacity?: number;
};

export class LitMaterial extends Material {
  public albedo: string;
  public normal_map: string;
  public specular_map: string;

  public ambient: vec3;
  public specular: vec3;
  public diffuse: vec3;

  private config?: PhongMaterialConfig;

  constructor(
    assetManager: AssetManager,
    shader: string,
    name: string,
    config?: PhongMaterialConfig,
  ) {
    super(assetManager, shader, name);
    this.config = config;
    this.albedo = config?.albedo_texture || 'none';
    this.normal_map = config?.normal_texture || 'none';
    this.specular_map = config?.specular_texture || 'none';
    this.ambient = config?.ambient || [1, 1, 1];
    this.specular = config?.specular || [1, 1, 1];
    this.diffuse = config?.diffuse || [1, 1, 1];
    this.opacity = config?.opacity ?? 1;
  }

  public setValues(values: LitMaterialValues) {
    this.normal_map = values.normal_map ?? this.normal_map;
    this.specular_map = values.specular_map ?? this.specular_map;
    this.albedo = values.albedo ?? this.albedo;
    this.ambient = values.ambient ?? this.ambient;
    this.specular = values.specular ?? this.specular;
    this.diffuse = values.diffuse ?? this.diffuse;
    this.opacity = values.opacity ?? this.opacity;
  }

  public clone() {
    return new LitMaterial(this.assetManager, this.shader, this.config);
  }

  public bindUbo(ubo: UBO) {
    ubo.bind();
    const albedoTexId = this.assetManager.getTexture(this.albedo)?.id ?? 16;
    // const normalTexId = this.webgl.textures[this.normal_map]?.id ?? 16;
    // const specularTexId = this.webgl.textures[this.specular_map]?.id ?? 16;

    const a = this.ambient;
    const s = this.specular;
    const d = this.diffuse;
    const o = this.opacity;
    ubo.set('ambient', [a[0], a[1], a[2], 0]);
    ubo.set('specular', [s[0], s[1], s[2], 0]);
    ubo.set('diffuse', [d[0], d[1], d[2], 0]);
    ubo.set('opacity', [o, 0, 0, 0]);
    ubo.set('textures', this.textureList());

    this.assetManager.getShader(this.shader)?.uniform('u_texture_albedo', {
      type: 'texture',
      value: albedoTexId,
    });
    //this.webgl.shaders[this.shader]?.uniform('u_texture_normal', { type: 'texture', value: normalTexId });
    //this.webgl.shaders[this.shader]?.uniform('u_texture_specular', { type: 'texture', value: specularTexId });
    ubo.unbind();
  }

  public bind() {
    this.assetManager.getShader(this.shader)?.bind();
    this.assetManager.getTexture(this.albedo)?.bind();
    this.assetManager.getTexture(this.normal_map)?.bind();
    this.assetManager.getTexture(this.specular_map)?.bind();
  }

  public unbind() {
    this.assetManager.getShader(this.shader)?.unbind();
    this.assetManager.getTexture(this.albedo)?.unbind();
    this.assetManager.getTexture(this.normal_map)?.unbind();
    this.assetManager.getTexture(this.specular_map)?.unbind();
  }

  private textureList(): vec4 {
    return [
      this.albedo !== 'none' ? 1 : 0,
      //this.normal_map !== '' ? 1 : 0,
      //this.specular_map !== '' ? 1 : 0,
      0,
      0,
      0,
    ];
  }
}
