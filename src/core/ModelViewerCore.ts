import { ArcballCamera } from '@/engine/controls/Arcball';
import { Controller } from '@/engine/controls/Controller';
import { WebGL } from '@/engine/render/gl/WebGL';
import { Camera } from '@/engine/render/Camera';
import { load_defaults } from './load_defaults';
import { EntityStoreState } from '@/store/entityStore';
import { ECS } from '@/engine/ecs/ECS';
import { Entity } from '@/engine/ecs/Entity';
import { Transform } from '@/engine/math/Transform';
import { AssetManager } from '@/engine/assets/AssetManager';
import { Mesh } from '@/engine/render/mesh/Mesh';
import { LightTypes } from '@/engine/render/light/types/light-types.type';
import type { LoaderEntry } from '@/engine/assets/assets.types';
import { LitMaterial } from '@/engine/render/material/LitMaterial';
import { Material } from '@/engine/render/material/Material';
import { Light } from '@/engine/render/light/Light';
import {
  LightSystem,
  MeshRenderSystem,
  ScriptSystem,
} from '@/engine/ecs/System';
import { Renderer } from '@/engine/render/Renderer';
import { ScriptManager } from '@/engine/scripting/ScriptManager';
import { LuaFactory } from 'wasmoon';
import { ScriptData } from '@/engine/scripting/scripts.types';
import { PostProccessStep } from '@/engine/render/PostProcessingStep';
import { Prefab } from '@/engine/ecs/Prefab';
import { Bindings } from '@/engine/controls/Bindings';

///////
//
//
//    This is the Editor Application
//
//
//
//    The Game application will be elsewhere and will run the actual game, this runs the whole editor
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
  public scriptManager?: ScriptManager;

  public ecs: ECS;
  private currentlySelected: Entity | null = null;
  private currentlySelectedMaterial: Material | null = null;

  public entityStore?: EntityStoreState;

  public initialized = false;
  private playing = false;

  public element: HTMLCanvasElement;

  constructor() {
    const input = new ArcballCamera(
      [0, 1, -5],
      [0, 0, 0],
      [0, 1, 0],
      10,
      [800, 600],
    );
    const controller = new Controller();
    input.registerController(controller);
    this.input = input;
    this.controller = controller;
    this.ecs = new ECS();

    this.element = document.createElement('canvas');
    this.element.width = 800;
    this.element.height = 600;
  }

  public get isPlaying() {
    return this.playing;
  }

  public play() {
    this.playing = true;
    this.camera?.enable();
    this.controller.enable();
  }

  public pause() {
    this.playing = false;
    this.camera?.disable();
    this.controller.disable();
  }

  public set darkMode(darkMode: boolean) {
    if (this.renderer) {
      this.renderer.darkMode = darkMode;
    }
  }

  public set showGrid(show: boolean) {
    if (this.renderer) {
      this.renderer.showGrid = show;
      return;
    }
  }

  public get showGrid(): boolean {
    if (this.renderer) {
      return this.renderer.showGrid;
    }
    return false;
  }

  public setEntityStore(es: EntityStoreState) {
    if (this.entityStore) return;
    this.entityStore = es;
  }

  public async initialize() {
    const ctx = this.element.getContext('webgl2');
    if (!ctx) throw new Error('could not create webgl2 rendering context');
    if (this.initialized) return;
    ctx.getExtension('EXT_color_buffer_float');
    const webgl = new WebGL(ctx);
    webgl.enable('cull_face', 'depth', 'blend');
    const camera = new Camera(
      webgl,
      (Math.PI / 180) * 65,
      800,
      600,
      0.001,
      1000,
      this.input,
    );
    const lua = await new LuaFactory().createEngine();
    this.scriptManager = new ScriptManager(this.ecs, lua);
    const assetManager = new AssetManager(webgl, this.scriptManager);
    this.assetManager = assetManager;
    await load_defaults(assetManager); // Must be loaded before scene is created @TODO: Must fix

    const gBufferShader = assetManager.getShader('g-buffer');
    if (!gBufferShader) throw new Error('could not find "g-buffer" shader');
    const lightShader = assetManager.getShader('lights');
    if (!lightShader) throw new Error('could not find "lights" shader');
    const screenShader = assetManager.getShader('screen');
    if (!screenShader) throw new Error('could not find "screen" shader');
    const gridShader = assetManager.getShader('grid');
    if (!gridShader) throw new Error('could not find "grid" shader');

    const renderer = new Renderer(
      webgl,
      [800, 600],
      lightShader,
      screenShader,
      gBufferShader,
      assetManager,
    );
    renderer.setupUBO({
      material: [gBufferShader],
      model: [gBufferShader, lightShader, screenShader, gridShader],
      lights: [lightShader],
    });
    camera.setupUBO([gBufferShader, gridShader]);
    gBufferShader.bind();
    gBufferShader.uniform('u_texture_albedo', { type: 'texture', value: 16 });
    gBufferShader.unbind();

    this.webgl = webgl;
    this.camera = camera;
    this.renderer = renderer;

    webgl.registerController(this.controller);

    const renderSystem = new MeshRenderSystem(renderer, camera);
    this.ecs.registerSystem('Render', renderSystem);
    const lightSystem = new LightSystem();
    this.ecs.registerSystem('Lights', lightSystem);

    if (this.assetManager && this.entityStore) {
      this.entityStore.setGeometryList(this.assetManager.geometryList);
      this.entityStore.setMaterialList(this.assetManager.materialList);
      this.entityStore.setMeshList(this.assetManager.meshList);
      this.entityStore.setScriptList(this.assetManager.scriptList);
      this.entityStore.setTextureList(this.assetManager.textureList);
    }

    this.ecs.registerSystem('Script', new ScriptSystem(this.scriptManager));

    const bindings = new Bindings({
      bindings: [
        {
          action: 'Create New Blank Entity',
          keys: ['Alt', 'e'],
          onKeyDown: () => {
            const entity = this.addEntity();
            this.setCurrentlySelected(entity);
          },
          onKeyUp: () => {},
        },
        {
          action: 'Create New Mesh Entity',
          keys: ['Alt', 'm'],
          onKeyDown: () => {
            const entity = this.addEntity('mesh');
            this.setCurrentlySelected(entity);
          },
          onKeyUp: () => {},
        },
        {
          action: 'Create New Light Entity',
          keys: ['Alt', 'l'],
          onKeyDown: () => {
            const entity = this.addEntity('light');
            this.setCurrentlySelected(entity);
          },
          onKeyUp: () => {},
        },
        {
          action: 'Create New Blank Lua Script File',
          keys: ['Alt', 's'],
          onKeyDown: () => {
            this.addScript(`lua-script-${crypto.randomUUID()}`, '');
          },
          onKeyUp: () => {},
        },
        {
          action: 'Create New Blank Post Processor File',
          keys: ['Alt', 'p'],
          onKeyDown: () => {
            this.addPostEffects(`post-effect-${crypto.randomUUID()}`);
          },
          onKeyUp: () => {},
        },
      ],
    });

    this.controller.registerBindings(bindings);
    this.controller.enable();

    this.initialized = true;
    return this;
  }

  public render() {
    this.ecs.runSystem('Lights');
    this.ecs.runSystem('Render');
    if (this.playing) {
      this.ecs.runSystem('Script');
    }
  }

  // Entity API
  public getEntityById(id: number) {
    return this.ecs.getEntityById(id);
  }

  public setCurrentlySelected(entity: Entity | null) {
    this.currentlySelected = entity;
    this.entityStore?.updateCurrentlySelected(entity?.serialize() ?? null);
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

  public cloneEntity(entity: Entity): Entity {
    const clone = this.ecs.cloneEntity(entity);
    this.syncEntities();
    return clone;
  }

  public spawnPrefab(name: string) {
    const ent = this.ecs.createPrefab(name);
    this.syncEntities();
    return ent;
  }

  public registerPrefab(prefab: Prefab) {
    this.ecs.registerPrefab(prefab);
    this.entityStore?.setPrefabsList(this.ecs.prefabList());
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

  public setScriptOnCurrentlySelected(type: 'update', scriptName: string) {
    if (!this.currentlySelected) return;
    const scriptComp =
      this.currentlySelected.getComponent<ScriptData>('Script');
    if (!scriptComp) return;

    switch (type) {
      case 'update': {
        scriptComp.data.update = scriptName;
        break;
      }
    }
    this.syncCurrentlySelected();
    this.syncEntities();
  }

  public removeComponentFromEntity(entity: Entity, name: string) {
    this.ecs.removeComponentFromEntity(entity, name);
    this.syncEntities();
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
    this.ecs.addComponentToEntity(
      entity,
      'Mesh',
      new Mesh(`mesh-${crypto.randomUUID()}`),
    );
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
    const material = new LitMaterial(this.assetManager, 'g-buffer', name);
    this.assetManager.addMaterial(name, material);
    this.entityStore?.setMaterialList(this.assetManager.materialList);
    return material;
  }

  public setCurrentlySelectedMaterial(material: Material | null) {
    this.currentlySelectedMaterial = material;
    this.entityStore?.updateCurrentlySelectedMaterial(material);
  }

  public getCurrentlySelectedMaterial(): Material | null {
    if (this.currentlySelectedMaterial) {
      return this.currentlySelectedMaterial;
    }
    return null;
  }

  public addScript(name: string, text: string) {
    if (this.scriptManager) {
      this.scriptManager.addScript(name, text);
      this.entityStore?.setScriptList(this.scriptManager.scriptList());
    }
  }

  public getScript(name: string) {
    return this.scriptManager?.getScript(name) ?? null;
  }

  public addPostEffects(name: string) {
    this.renderer?.createPostProcessStep(name, '', '');
  }

  public getPostEffects(): PostProccessStep[] {
    return this.renderer?.getPostEffects() ?? [];
  }
}
