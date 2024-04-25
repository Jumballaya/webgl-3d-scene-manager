import { ECS } from './ECS';
import { Entity } from './Entity';
import { isClonable } from './util';

type PrefabData = {
  name: string;
  components: Array<[string, unknown]>;
  children: PrefabData[];
};

export class Prefab {
  private ecs: ECS;
  private data: PrefabData;

  public name: string;

  constructor(ecs: ECS, data: PrefabData) {
    this.name = data.name;
    this.ecs = ecs;
    this.data = data;
  }

  public static FromEntity(entity: Entity, ecs: ECS): Prefab {
    return new Prefab(ecs, this.DataFromEntity(entity));
  }

  public static DataFromEntity(entity: Entity): PrefabData {
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
        } else if (typeof component.data === 'object') {
          data.components.push([compName, { ...component.data }]);
        } else {
          data.components.push([compName, component.data]);
        }
        if (compName === 'Name' && typeof component.data === 'string') {
          data.name = component.data;
        }
      }
    }

    for (const child of entity.children) {
      data.children.push(Prefab.DataFromEntity(child));
    }

    return data;
  }

  public create() {
    return this.entityFromData(this.data);
  }

  private entityFromData(data: PrefabData): Entity {
    const entity = this.ecs.createEntity();
    for (const compEntry of data.components) {
      const [className, params] = compEntry;
      if (isClonable(params)) {
        this.ecs.addComponentToEntity(entity, className, params.clone());
      } else {
        this.ecs.addComponentToEntity(entity, className, params);
      }
    }

    for (const child of data.children) {
      const childEnt = this.entityFromData(child);
      entity.addChild(childEnt);
    }

    return entity;
  }
}
