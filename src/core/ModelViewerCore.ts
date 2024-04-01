import { ArcballCamera } from '@/renderer/controls/Arcball';
import { Controller } from '@/renderer/controls/Controller';
import { WebGL } from '@/renderer/gl/WebGL';
import { Camera } from '@/renderer/viewer/Camera';
import { Renderer } from '@/renderer/viewer/Renderer';
import { load_defaults } from './load_defaults';
import { EntityStoreState } from '@/store/entityStore';
import { ECS } from '@/renderer/viewer/ecs/ECS';
import { Entity } from '@/renderer/viewer/ecs/Entity';
import { Transform } from '@/renderer/math/Transform';
import { AssetManager } from '@/renderer/assets/AssetManager';
import { Mesh } from '@/renderer/viewer/Mesh';
import { LightTypes } from '@/renderer/viewer/light/types/light-types.type';
import { LoaderEntry } from '@/renderer/viewer/Loader';
import { LitMaterial } from '@/renderer/viewer/material/LitMaterial';
import { Material } from '@/renderer/viewer/material/Material';
import { Light } from '@/renderer/viewer/light/Light';
import { LightSystem, MeshRenderSystem } from '@/renderer/viewer/ecs/System';

///////
//
//
//   Rework the Entity from the renderer (scene) up:
//
//      3. Entity Components:
//          a. Universal Components
//             i.  Name, Transform
//             ii. Name is added by default
//          b. Render Components
//             i. Mesh (Geometry and Material), Light (type and props)
//          c. Can add Components and children in the details sidebar
//          d. Can only have 1 kind of render component
//
//
////////

export class ModelViewerCore {
  public webgl?: WebGL;
  public assetManager?: AssetManager;
  public camera?: Camera;
  public renderer?: Renderer;
  public controller: Controller;
  public input: ArcballCamera;

  public ecs: ECS;
  private currentlySelected: Entity | null = null;

  public entityStore?: EntityStoreState;

  public initialized = false;

  constructor() {
    const input = new ArcballCamera(
      [0, 1, -5],
      [0, 0, 0],
      [0, 1, 0],
      10,
      [1024, 768],
    );
    const controller = new Controller();
    input.registerController(controller);
    this.input = input;
    this.controller = controller;
    this.ecs = new ECS();
  }

  public set darkMode(darkMode: boolean) {
    if (this.renderer) {
      this.renderer.darkMode = darkMode;
    }
  }

  public set showGrid(show: boolean) {
    if (this.renderer) {
      this.renderer.showGrid = show;
    }
  }

  public get showGrid(): boolean {
    if (this.renderer) {
      return this.renderer.showGrid;
    }
    return false;
  }

  public setEntityStore(es: EntityStoreState) {
    this.entityStore = es;
  }

  public async initialize(ctx: WebGL2RenderingContext) {
    if (this.initialized) return;
    const webgl = new WebGL(ctx);
    const camera = new Camera(
      webgl,
      (Math.PI / 180) * 65,
      1024,
      768,
      0.001,
      1000,
      this.input,
    );
    const assetManager = new AssetManager(webgl);
    this.assetManager = assetManager;
    await load_defaults(assetManager); // Must be loaded before scene is created @TODO: Must fix
    const renderer = new Renderer(webgl, camera, assetManager);

    this.webgl = webgl;
    this.camera = camera;
    this.renderer = renderer;

    webgl.registerController(this.controller);

    const renderSystem = new MeshRenderSystem(renderer);
    this.ecs.registerSystem('Render', renderSystem);
    const lightSystem = new LightSystem();
    this.ecs.registerSystem('Lights', lightSystem);

    this.initialized = true;
    return this;
  }

  public render() {
    this.ecs.runSystem('Lights');
    this.ecs.runSystem('Render');
  }

  public draw() {
    this.render();
    requestAnimationFrame(this.draw.bind(this));
  }

  // Entity API
  public getEntityById(id: number) {
    return this.ecs.getEntityById(id);
  }

  public setCurrentlySelected(entity: Entity | null) {
    this.currentlySelected = entity;
    this.syncCurrentlySelected();
  }

  public getCurrentlySelected(): Entity | null {
    if (this.currentlySelected) {
      return this.currentlySelected;
    }
    return null;
  }

  public addEntity(type?: 'mesh' | 'light'): Entity {
    const ent = this.ecs.createEntity();
    this.ecs.addComponentToEntity(
      ent,
      'Name',
      `entity-${ent.id.toString().padStart(4, '0')}`,
    );
    if (type === 'mesh') {
      this.addMesh(ent);
    }
    if (type === 'light') {
      this.addLight(ent);
    }
    this.syncEntities();
    return ent;
  }

  public deleteEntity(id: number) {
    this.ecs.deleteEntity(id);
    if (this.currentlySelected?.id === id) {
      this.setCurrentlySelected(null);
      this.syncCurrentlySelected();
    }
    this.syncEntities();
  }

  public addChildToEntity(ent: Entity, child: Entity) {
    ent.addChild(child);
    this.syncCurrentlySelected();
    this.syncEntities();
  }

  public get entities() {
    return this.ecs.serializeEntities();
  }

  // Entity Details API
  public get meshList() {
    return this.assetManager?.meshList ?? [];
  }

  public get textureList(): string[] {
    return this.assetManager?.textureList ?? [];
  }

  public addComponentToEntity(entity: Entity, name: string, data: unknown) {
    this.ecs.addComponentToEntity(entity, name, data);
    this.syncEntities();
  }

  public addComponentToCurrentlySelected(name: string, data: unknown) {
    if (this.currentlySelected) {
      this.addComponentToEntity(this.currentlySelected, name, data);
      this.syncCurrentlySelected();
    }
  }

  public updateComponentOnEntity(
    entity: Entity,
    name: string,
    update: unknown,
  ) {
    this.ecs.updateComponentOnEntity(entity, name, update);
    this.syncEntities();
  }

  public updateComponentOnCurrentlySelected(name: string, data: unknown) {
    if (this.currentlySelected) {
      this.updateComponentOnEntity(this.currentlySelected, name, data);
      this.syncCurrentlySelected();
      this.syncEntities();
    }
  }

  public removeComponentFromEntity(entity: Entity, name: string) {
    this.ecs.removeComponentFromEntity(entity, name);
  }

  public removeComponentFromCurrentlySelected(name: string) {
    if (this.currentlySelected) {
      this.removeComponentFromEntity(this.currentlySelected, name);
      this.syncCurrentlySelected();
    }
  }

  public updateMeshOnEntity(entity: Entity, meshName: string) {
    if (!this.assetManager) return;
    const newMesh = this.assetManager.getMesh(meshName);
    if (!newMesh) return;
    this.updateComponentOnEntity(entity, 'Mesh', newMesh.clone());
    this.syncEntities();
  }

  public createLight<T extends keyof LightTypes>(
    type: T,
  ): LightTypes[T] | null {
    return this.renderer?.createLight(type) ?? null;
  }

  public removeLight(light: Light) {
    this.renderer?.removeLight(light);
  }

  private syncCurrentlySelected() {
    this.entityStore?.updateCurrentlySelected(
      this.currentlySelected?.serialize() || null,
    );
    return;
  }

  private syncEntities() {
    this.entityStore?.setEntities(this.ecs.serializeEntities());
  }

  private addLight(entity: Entity) {
    if (this.renderer) {
      const light = this.renderer.createLight('point');
      this.ecs.addComponentToEntity(entity, 'Light', light);
    }
    this.ecs.addComponentToEntity(entity, 'Transform', new Transform());
  }

  private addMesh(entity: Entity) {
    const cube = this.assetManager?.getMesh('cube');
    if (cube) {
      this.ecs.addComponentToEntity(entity, 'Mesh', cube.clone());
    }
    this.ecs.addComponentToEntity(entity, 'Transform', new Transform());
  }

  // Asset Manager API
  public async processFiles(files: FileList) {
    if (!this.assetManager) return;
    const loadInstructions: LoaderEntry[] = [];
    const toUpdate = {
      textures: false,
      geometries: false,
      materials: false,
    };
    for (const file of files) {
      if (file.type.includes('image')) {
        loadInstructions.push({
          type: 'texture:src',
          name: file.name,
          file,
        });
        toUpdate.textures = true;
      }
      if (file.name.toLowerCase().includes('.obj')) {
        loadInstructions.push({
          type: 'geometry:src',
          name: file.name,
          fileType: 'obj',
          file,
        });
        toUpdate.geometries = true;
      }
      if (file.name.toLowerCase().includes('.mtl')) {
        loadInstructions.push({
          type: 'material:src',
          name: file.name,
          fileType: 'mtl',
          file,
        });
      }
      toUpdate.materials = true;
    }

    await this.assetManager.load(loadInstructions);

    if (toUpdate.textures) {
      this.entityStore?.setTextureList(this.assetManager.textureList);
    }
    if (toUpdate.geometries) {
      this.entityStore?.setGeometryList(this.assetManager.geometryList);
    }
    if (toUpdate.materials) {
      this.entityStore?.setMaterialList(this.assetManager.materialList);
    }
  }

  public createMesh(name: string): Mesh | null {
    if (!this.webgl) return null;
    return new Mesh(name);
  }

  public getMesh(name: string): Mesh | null {
    return this.assetManager?.getMesh(name) ?? null;
  }

  public createMaterial(name: string): Material | null {
    if (!this.assetManager) return null;
    const material = new LitMaterial(this.assetManager, 'lights', name);
    this.assetManager.addMaterial(name, material);
    this.entityStore?.setMaterialList(this.assetManager.materialList);
    return material;
  }
}
