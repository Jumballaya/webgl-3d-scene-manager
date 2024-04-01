import { SerializedEntity } from '@/renderer/viewer/ecs/Entity';
import { create } from 'zustand';

export type EntityStoreState = {
  // NEW
  entities: SerializedEntity[];
  currentlySelected: SerializedEntity | null;
  meshList: string[];
  textureList: string[];
  geometryList: string[];
  materialList: string[];
  updateCurrentlySelected: (e: SerializedEntity | null) => void;
  setEntities: (entities: SerializedEntity[]) => void;
  setTextureList: (textures: string[]) => void;
  setMeshList: (textures: string[]) => void;
  setGeometryList: (geometries: string[]) => void;
  setMaterialList: (materials: string[]) => void;
};

export const useEntityStore = create<EntityStoreState>((set) => ({
  entities: [],
  currentlySelected: null,
  meshList: ['none'],
  geometryList: ['none', 'quad'],
  textureList: ['none'],
  materialList: ['none'],
  updateCurrentlySelected: (e: SerializedEntity | null) =>
    set((state) => ({
      ...state,
      currentlySelected: e,
    })),
  setEntities: (entities: SerializedEntity[]) =>
    set((state) => ({
      ...state,
      entities,
    })),
  setTextureList: (textureList: string[]) =>
    set((state) => ({
      ...state,
      textureList: ['none', ...textureList],
    })),
  setMeshList: (meshList: string[]) =>
    set((state) => ({
      ...state,
      meshList: ['none', ...meshList],
    })),
  setGeometryList: (geoList: string[]) =>
    set((state) => ({
      ...state,
      geometryList: ['none', ...geoList],
    })),
  setMaterialList: (matList: string[]) =>
    set((state) => ({
      ...state,
      materialList: ['none', ...matList],
    })),
}));
