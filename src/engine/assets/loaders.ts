import { Geometry } from '../render/geometry/Geometry';
import { WebGL } from '../render/gl/WebGL';
import { ObjFile } from './obj/ObjFile';
import { Material } from '../render/material/Material';
import { LitMaterial } from '../render/material/LitMaterial';
import { Mesh } from '../render/mesh/Mesh';
import { AssetManager } from './AssetManager';
import { MtlFile } from './obj/MtlFile';

export function loadObjFileGeometries(
  webgl: WebGL,
  name: string,
  fileContents: string,
): Geometry[] {
  const objFile = new ObjFile(name, fileContents);
  const contents = objFile.parse();

  const geometries: Geometry[] = [];
  for (const obj of contents.meshes) {
    const vertexArray = webgl.createVertexArray({
      drawType: WebGL2RenderingContext.STATIC_DRAW,
      buffers: obj.buffers,
    });
    const geo = new Geometry(vertexArray, obj.name);
    geometries.push(geo);
  }

  return geometries;
}

export function loadMtlFileMaterial(
  assetManager: AssetManager,
  name: string,
  fileContents: string,
): Record<string, Material> {
  const material = new MtlFile(fileContents, name);
  material.parse();
  const mats: Record<string, Material> = {};
  const list = material.getMaterials();
  for (const mat of list) {
    mats[mat.name] = new LitMaterial(
      assetManager,
      'g-buffer',
      mat.name,
      mat.config,
    );
  }
  return mats;
}

export async function loadObj(
  base: string,
  file: string,
  webgl: WebGL,
  modelShader: string,
  name: string,
  assetManager: AssetManager,
): Promise<Mesh[]> {
  const objFile = await ObjFile.FromFile(file, base);
  const contents = objFile.parse();

  for (const material of contents.materials) {
    for (const texToLoad of material.getTexturesToLoad()) {
      const texture = await webgl.loadTexture(texToLoad.path);
      assetManager.addTexture(texToLoad.name, texture);
    }
  }

  const mats: Record<string, Material> = {};
  for (const material of contents.materials) {
    const list = material.getMaterials();
    for (const mat of list) {
      mats[mat.name] = new LitMaterial(
        assetManager,
        modelShader,
        mat.name,
        mat.config,
      );
    }
  }

  const defaultMaterial = new LitMaterial(
    assetManager,
    modelShader,
    'default',
    {
      name: 'default',
    },
  );

  const meshes: Mesh[] = [];
  for (const obj of contents.meshes) {
    const vertexArray = webgl.createVertexArray({
      drawType: WebGL2RenderingContext.STATIC_DRAW,
      buffers: obj.buffers,
    });
    const geo = new Geometry(vertexArray, name);
    const mat = defaultMaterial.clone();
    meshes.push(new Mesh(obj.name.toLowerCase(), geo, mat));
  }

  return meshes;
}

export async function loadGeometry(
  base: string,
  file: string,
  webgl: WebGL,
  name: string,
): Promise<Geometry[]> {
  const objFile = await ObjFile.FromFile(file, base);
  const contents = objFile.parse();

  const geometries: Geometry[] = [];
  for (const obj of contents.meshes) {
    const vertexArray = webgl.createVertexArray({
      drawType: WebGL2RenderingContext.STATIC_DRAW,
      buffers: obj.buffers,
    });
    geometries.push(new Geometry(vertexArray, name));
  }

  return geometries;
}

export function loadImage(path: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const img = new Image();
    img.addEventListener('load', () => res(img));
    img.addEventListener('error', (e) => rej(e));
    let fullpath = path;
    if (fullpath[0] === '/' && fullpath[1] === '/')
      fullpath = fullpath.slice(1);
    img.src = fullpath;
  });
}

export async function loadText(path: string): Promise<string> {
  const response = await fetch(path);
  return response.text();
}
