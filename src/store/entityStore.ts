import { SerializedEntity } from '@/engine/ecs/Entity';
import { Material } from '@/engine/render/material/Material';
import { create } from 'zustand';

export type EntityStoreState = {
  entities: SerializedEntity[];
  currentlySelected: SerializedEntity | null;
  currentlySelectedMaterial: Material | null;
  meshList: string[];
  textureList: string[];
  geometryList: string[];
  materialList: string[];
  scriptList: string[];
  prefabList: string[];
  updateCurrentlySelected: (e: SerializedEntity | null) => void;
  updateCurrentlySelectedMaterial: (m: Material | null) => void;
  setEntities: (entities: SerializedEntity[]) => void;
  setTextureList: (textures: string[]) => void;
  setMeshList: (textures: string[]) => void;
  setGeometryList: (geometries: string[]) => void;
  setMaterialList: (materials: string[]) => void;
  setScriptList: (scripts: string[]) => void;
  setPrefabsList: (prefabs: string[]) => void;
};

export const useEntityStore = create<EntityStoreState>((set) => ({
  entities: [],
  currentlySelected: null,
  currentlySelectedMaterial: null,
  meshList: ['none'],
  geometryList: ['none', 'quad'],
  textureList: ['none'],
  materialList: ['none'],
  scriptList: ['none'],
  prefabList: ['none'],
  updateCurrentlySelected: (e: SerializedEntity | null) =>
    set((state) => ({
      ...state,
      currentlySelected: e,
      currentlySelectedMaterial: null,
    })),
  updateCurrentlySelectedMaterial: (m: Material | null) =>
    set((state) => ({
      ...state,
      currentlySelectedMaterial: m,
      currentlySelected: null,
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
  setScriptList: (scriptList: string[]) =>
    set((state) => ({
      ...state,
      scriptList: ['none', ...scriptList],
    })),
  setPrefabsList: (prefabList: string[]) =>
    set((state) => ({
      ...state,
      prefabList: ['none', ...prefabList],
    })),
}));
