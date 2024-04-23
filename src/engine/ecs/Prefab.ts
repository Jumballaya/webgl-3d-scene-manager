import { ECS } from './ECS';
import { Entity } from './Entity';

type PrefabData = {
  name: string;
  components: Array<[string, unknown]>;
  children: PrefabData[];
};

export class Prefab {
  private ecs: ECS;
  private components: Array<[string, unknown]> = [];

  public name: string;

  constructor(ecs: ECS, data: PrefabData) {
    this.name = data.name;
    this.ecs = ecs;
    for (const [className, params] of data.components) {
      this.components.push([className, params]);
    }
  }

  public static FromEntity(entity: Entity, ecs: ECS): Prefab {
    const data: PrefabData = {
      name: '',
      components: [],
      children: [],
    };
    const components = entity.componentList;

    for (const compName of components) {
      const component = entity.getComponent(compName);
      if (component) {
        if (isClonable(component.data)) {
          data.components.push([compName, component.data.clone()]);
        } else {
          data.components.push([compName, component.data]);
        }
        if (compName === 'Name' && typeof component.data === 'string') {
          data.name = component.data;
        }
      }
    }

    return new Prefab(ecs, data);
  }

  public create(override: unknown[]) {
    const entity = this.ecs.createEntity();
    let i = 0;
    for (const compEntry of this.components) {
      const overrideParams = override[i];
      const [className, params] = compEntry;
      if (overrideParams) {
        if (isClonable(overrideParams)) {
          this.ecs.addComponentToEntity(
            entity,
            className,
            overrideParams.clone(),
          );
        } else {
          this.ecs.addComponentToEntity(entity, className, overrideParams);
        }
      } else {
        if (isClonable(params)) {
          this.ecs.addComponentToEntity(entity, className, params.clone());
        } else {
          this.ecs.addComponentToEntity(entity, className, params);
        }
      }
      i++;
    }
    return entity;
  }
}

function isClonable(obj: unknown): obj is { clone: () => unknown } {
  if (typeof obj === 'string') return false;
  if (typeof obj === 'number') return false;
  if (typeof obj === 'boolean') return false;
  if (typeof obj === 'symbol') return false;
  if (typeof obj === 'bigint') return false;
  if (typeof obj === 'undefined') return false;
  if (obj === null) return false;
  return Object.keys(obj).includes('clone');
}
