import { Transform } from '../../math/Transform';
import { Renderer } from '../Renderer';
import { Entity } from './Entity';
import { Light } from '../light/Light';

export type System = {
  requiredComponents: string[];
  run: (entities: Entity[]) => void;
};

export class MeshRenderSystem implements System {
  public requiredComponents = ['Transform', 'Mesh'];

  private renderer: Renderer;

  constructor(renderer: Renderer) {
    this.renderer = renderer;
  }

  public run(entities: Entity[]) {
    this.renderer.render(entities);
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
