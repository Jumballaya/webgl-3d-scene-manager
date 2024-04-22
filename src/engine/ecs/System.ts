import { Transform } from '@/engine/math/Transform';
import { Renderer } from '@/engine/render/Renderer';
import { Entity } from './Entity';
import { Light } from '@/engine/render/light/Light';
import { Mesh } from '@/engine/render/mesh/Mesh';
import { Camera } from '@/engine/render/Camera';
import { ScriptData } from '../scripting/scripts.types';
import { ScriptManager } from '../scripting/ScriptManager';

export type System = {
  requiredComponents: string[];
  run: (entities: Entity[]) => void;
};

export class MeshRenderSystem implements System {
  public requiredComponents = ['Transform', 'Mesh'];

  private renderer: Renderer;
  private camera: Camera;

  constructor(renderer: Renderer, camera: Camera) {
    this.renderer = renderer;
    this.camera = camera;
  }

  public run(entities: Entity[]) {
    for (const entity of entities) {
      const mesh = entity.getComponent<Mesh>('Mesh')?.data;
      const transform = entity.getComponent<Transform>('Transform')?.data;
      if (mesh && transform) {
        const { geometry, material } = mesh;
        if (geometry && material) {
          this.renderer.add(geometry, transform, material);
        }
      }
    }
    this.renderer.render(this.camera);
  }
}

export class LightSystem implements System {
  public requiredComponents = ['Transform', 'Light'];

  public run(entities: Entity[]) {
    for (const ent of entities) {
      const transComp = ent.getComponent<Transform>('Transform');
      const lightComp = ent.getComponent<Light>('Light');
      if (transComp && lightComp) {
        lightComp.data.position = transComp.data.translation;
      }
    }
  }
}

export class ScriptSystem implements System {
  public requiredComponents = ['Script'];
  private scriptManager: ScriptManager;

  private time = Date.now();

  constructor(scriptManager: ScriptManager) {
    this.scriptManager = scriptManager;
  }

  public run(entities: Entity[]) {
    const time = Date.now();
    const deltaTime = time - this.time;
    this.time = time;

    for (const ent of entities) {
      const scriptComponent = ent.getComponent<ScriptData>('Script');
      if (!scriptComponent) continue;
      const { data } = scriptComponent;
      if (data.update) {
        const script = this.scriptManager.getScript<[number]>(data.update);
        if (script) {
          script.runScript(ent, deltaTime);
        }
      }
    }
  }
}
