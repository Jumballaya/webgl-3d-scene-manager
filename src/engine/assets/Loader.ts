import { AssetManager } from './AssetManager';
import {
  loadText,
  loadObj,
  loadGeometry,
  loadObjFileGeometries,
  loadMtlFileMaterial,
} from './loaders';
import { WebGL } from '../render/gl/WebGL';
import { readImageFile, readTextFile } from './file-reader';
import { LoaderEntry, LoaderOutput } from './assets.types';

export class Loader {
  private webgl: WebGL;

  constructor(webgl: WebGL) {
    this.webgl = webgl;
  }

  public async load(items: LoaderEntry[], assetManager: AssetManager) {
    const out: LoaderOutput = {
      meshes: {},
      textures: {},
      geometries: {},
      materials: {},
      shaders: {},
      scripts: {},
    };
    for (const item of items) {
      switch (item.type) {
        case 'obj:network': {
          if (!item.dir.endsWith('/')) item.dir = item.dir + '/';
          const meshes = await this.loadObjNetwork(
            item.dir,
            item.file,
            item.shader,
            item.name,
            assetManager,
          );
          for (const mesh of meshes) {
            out.meshes[mesh.name] = mesh;
          }
          break;
        }
        case 'shader:src': {
          const shader = this.loadShaderSource(
            item.name,
            item.vertex,
            item.fragment,
          );
          out.shaders[shader.name] = shader;
          break;
        }
        case 'texture:network': {
          const texture = await this.loadTextureNetwork(item.path);
          out.textures[item.name] = texture;
          break;
        }
        case 'texture:src': {
          const imageFile = await readImageFile(item.file);
          const texture = this.webgl.createTexture(imageFile);
          out.textures[item.name] = texture;
          break;
        }
        case 'geometry:src': {
          const contents = await readTextFile(item.file);
          const geometries = loadObjFileGeometries(
            this.webgl,
            item.name,
            contents,
          );
          for (const geo of geometries) {
            out.geometries[geo.name] = geo;
          }
          break;
        }
        case 'geometry:network': {
          if (!item.dir.endsWith('/')) item.dir = item.dir + '/';
          const geometries = await this.loadGeometryNetwork(
            item.dir,
            item.file,
            item.name,
          );
          for (const geo of geometries) {
            out.geometries[geo.name] = geo;
          }
          break;
        }
        case 'material:src': {
          const contents = await readTextFile(item.file);
          const materials = loadMtlFileMaterial(
            assetManager,
            item.name,
            contents,
          );
          out.materials = { ...out.materials, ...materials };
          break;
        }
        case 'script:network': {
          if (!item.dir.endsWith('/')) item.dir = item.dir + '/';
          const script = await loadText(`${item.dir}${item.file}`);
          out.scripts[item.name] = script;
          break;
        }
      }
    }
    return out;
  }

  private async loadTextureNetwork(path: string) {
    const texture = await this.webgl.loadTexture(path);
    return texture;
  }

  private loadShaderSource(name: string, vertex: string, fragment: string) {
    const shader = this.webgl.createShader(name, vertex, fragment);
    return shader;
  }

  private async loadObjNetwork(
    dir: string,
    file: string,
    shader: string,
    name: string,
    assetManager: AssetManager,
  ) {
    const meshes = await loadObj(
      dir,
      file,
      this.webgl,
      shader,
      name,
      assetManager,
    );
    return meshes;
  }

  private async loadGeometryNetwork(dir: string, file: string, name: string) {
    const geometries = await loadGeometry(dir, file, this.webgl, name);
    return geometries;
  }
}
