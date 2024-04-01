import { AssetManager } from '@/renderer/assets/AssetManager';
import { UBO } from '../../gl/UBO';
import { Uniform } from '../../gl/types/uniforms.type';

export class Material {
  protected assetManager: AssetManager;
  protected shader: string;
  protected textures: Array<string> = [];
  public opacity: number = 1;

  public cullFace = true;
  public name: string;

  constructor(assetManager: AssetManager, shader: string, name: string) {
    this.assetManager = assetManager;
    this.shader = shader;
    this.name = name;
  }

  public clone() {
    return new Material(this.assetManager, this.shader, this.name);
  }

  public bind() {
    this.assetManager.getShader(this.shader)?.bind();
    for (const tex of this.textures) {
      this.assetManager.getTexture(tex)?.bind();
    }
  }

  public bindUbo(_: UBO) {}

  public unbind() {
    this.assetManager.getShader(this.shader)?.unbind();
    for (const tex of this.textures) {
      this.assetManager.getTexture(tex)?.unbind();
    }
  }

  public uniform(name: string, uniform: Uniform) {
    this.assetManager.getShader(this.shader)?.uniform(name, uniform);
  }

  public texture(name: string) {
    this.textures.push(name);
  }

  public setValues(_: Record<string, unknown>) {}
}
