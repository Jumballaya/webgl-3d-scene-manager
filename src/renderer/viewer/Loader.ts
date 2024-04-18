import { AssetManager } from '../assets/AssetManager';
import {
  loadObj,
  loadGeometry,
  loadObjFileGeometries,
  loadMtlFileMaterial,
} from '../assets/obj-loader';
import { Shader } from '../gl/Shader';
import { Texture } from '../gl/Texture';
import { WebGL } from '../gl/WebGL';
import { Mesh } from './Mesh';
import { Geometry } from './geometry/Geometry';
import { Material } from './material/Material';

export type LoaderEntry =
  | TextureNetworkEntry
  | ShaderSrcEntry
  | ObjNetworkEntry
  | TextureSrcEntry
  | MaterialSrcEntry
  | GeometrySrcEntry
  | GeometryNetworkEntry;

type TextureNetworkEntry = {
  type: 'texture:network';
  name: string;
  path: string;
};

type TextureSrcEntry = {
  type: 'texture:src';
  name: string;
  file: File;
};

type GeometrySrcEntry = {
  type: 'geometry:src';
  fileType: 'obj';
  name: string;
  file: File;
};

type GeometryNetworkEntry = {
  name: string;
  type: 'geometry:network';
  dir: string;
  file: string;
};

type MaterialSrcEntry = {
  type: 'material:src';
  fileType: 'mtl';
  name: string;
  file: File;
};

type ShaderSrcEntry = {
  type: 'shader:src';
  name: string;
  vertex: string;
  fragment: string;
};

type ObjNetworkEntry = {
  name: string;
  type: 'obj:network';
  dir: string;
  file: string;
  shader: string;
};

type LoaderOutput = {
  meshes: Record<string, Mesh>;
  textures: Record<string, Texture>;
  geometries: Record<string, Geometry>;
  materials: Record<string, Material>;
  shaders: Record<string, Shader>;
};

async function readImageFile(file: File): Promise<HTMLImageElement> {
  const fileReader = new FileReader();
  return new Promise((res, rej) => {
    fileReader.onload = () => {
      const img = new Image();
      img.onload = () => {
        res(img);
      };
      img.title = file.name;
      img.src = fileReader.result as string;
    };
    fileReader.onerror = (e) => {
      rej(e);
    };
    fileReader.readAsDataURL(file);
  });
}

async function readTextFile(file: File): Promise<string> {
  const fileReader = new FileReader();
  return new Promise((res, rej) => {
    fileReader.onload = () => {
      res(fileReader.result as string);
    };
    fileReader.onerror = (e) => {
      rej(e);
    };
    fileReader.readAsText(file);
  });
}

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
