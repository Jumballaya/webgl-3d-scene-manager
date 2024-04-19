import { Geometry } from '../render/geometry/Geometry';
import { Shader } from '../render/gl/Shader';
import { Texture } from '../render/gl/Texture';
import { Material } from '../render/material/Material';
import { Mesh } from '../render/mesh/Mesh';

export type LoaderEntry =
  | TextureNetworkEntry
  | ShaderSrcEntry
  | ObjNetworkEntry
  | TextureSrcEntry
  | MaterialSrcEntry
  | GeometrySrcEntry
  | GeometryNetworkEntry
  | ScriptNetworkEntry;

export type TextureNetworkEntry = {
  type: 'texture:network';
  name: string;
  path: string;
};

export type TextureSrcEntry = {
  type: 'texture:src';
  name: string;
  file: File;
};

export type GeometrySrcEntry = {
  type: 'geometry:src';
  fileType: 'obj';
  name: string;
  file: File;
};

export type GeometryNetworkEntry = {
  type: 'geometry:network';
  name: string;
  dir: string;
  file: string;
};

export type MaterialSrcEntry = {
  type: 'material:src';
  fileType: 'mtl';
  name: string;
  file: File;
};

export type ShaderSrcEntry = {
  type: 'shader:src';
  name: string;
  vertex: string;
  fragment: string;
};

export type ObjNetworkEntry = {
  type: 'obj:network';
  dir: string;
  name: string;
  file: string;
  shader: string;
};

export type ScriptNetworkEntry = {
  type: 'script:network';
  dir: string;
  name: string;
  file: string;
};

export type LoaderOutput = {
  meshes: Record<string, Mesh>;
  textures: Record<string, Texture>;
  geometries: Record<string, Geometry>;
  materials: Record<string, Material>;
  shaders: Record<string, Shader>;
  scripts: Record<string, string>;
};
