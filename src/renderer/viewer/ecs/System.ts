import { Transform } from '../../math/Transform';
import { Renderer } from '@/renderer/viewer/Renderer';
import { Entity } from './Entity';
import { Light } from '../light/Light';
import { Mesh } from '../Mesh';
import { Camera } from '../Camera';

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
      const transfrom = entity.getComponent<Transform>('Transform')?.data;
      if (mesh && transfrom) {
        const { geometry, material } = mesh;
        if (geometry && material) {
          this.renderer.add(geometry, transfrom, material);
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
