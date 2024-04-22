import { Entity } from './Entity';
import {
  Component,
  LightComponent,
  MeshComponent,
  NameComponent,
  ScriptComponent,
  TransformComponent,
} from './Component';
import { System } from './System';

type ComponentMap = Record<string, Record<number, Component<unknown>>>;

const _components = {
  Name: NameComponent,
  Transform: TransformComponent,
  Mesh: MeshComponent,
  Light: LightComponent,
  Script: ScriptComponent,
};

export class ECS {
  public componentList = ['Name', 'Transform', 'Mesh', 'Light', 'Script'];
  private components: ComponentMap = {};
  private entities: Entity[] = [];
  private systems: Map<string, System> = new Map();

  constructor() {
    for (const c of this.componentList) {
      this.components[c] = {};
    }
  }

  public registerSystem(name: string, system: System) {
    this.systems.set(name, system);
  }

  public runSystem(name: string) {
    const system = this.systems.get(name);
    if (!system) return;
    const entities = this.getEntitiesByComponents(system.requiredComponents);
    system.run(entities);
  }

  public createEntity(): Entity {
    const ent = new Entity();
    this.entities.push(ent);
    return ent;
  }

  public deleteEntity(id: number) {
    const entity = this.getEntityById(id);
    if (entity) {
      const idsToExclude = this.getIdList(entity);
      const entityList: Entity[] = [];
      for (const ent of this.entities) {
        if (!idsToExclude.includes(ent.id)) {
          entityList.push(ent);
        }
        ent.purgeChildrenById(idsToExclude);
      }
      this.entities = entityList;
    }
  }

  public addComponentToEntity<T>(
    entity: Entity,
    name: string,
    defaultValue: T,
  ) {
    if (!this.componentList.some((cname) => cname === name)) {
      throw new Error(`Could not find a reference to the component "${name}"`);
    }
    const comp = this.getComponentConstructor(name as keyof typeof _components);
    const component = new comp(defaultValue);
    this.components[name][entity.id] = component;
    entity.attachComponent(component);
  }

  public updateComponentOnEntity<T>(entity: Entity, name: string, value: T) {
    if (!this.componentList.some((cname) => cname === name)) {
      throw new Error(`Could not find a reference to the component "${name}"`);
    }
    const found = this.components[name][entity.id] as Component<T>;
    if (found) {
      found.data = value;
    }
  }

  public removeComponentFromEntity(entity: Entity, name: string) {
    if (!this.componentList.some((cname) => cname === name)) {
      throw new Error(`Could not find a reference to the component "${name}"`);
    }
    const found = this.components[name][entity.id];
    if (found) {
      delete this.components[name][entity.id];
      entity.removeComponent(name);
    }
  }

  public serializeEntities() {
    const list = [];
    const seen: Set<number> = new Set();
    for (const e of this.entities) {
      if (seen.has(e.id)) {
        continue;
      }
      list.push(e.serialize(seen));
    }
    return list;
  }

  public getEntityById(id: number): Entity | null {
    let found: Entity | null = null;
    for (const ent of this.entities) {
      if (ent.id === id) {
        found = ent;
        break;
      }
    }
    return found;
  }

  public getEntitiesByComponents(components: string[]) {
    const entities = [];
    for (const ent of this.entities) {
      let hasComps = true;
      for (const comp of components) {
        if (!ent.hasComponent(comp)) {
          hasComps = false;
        }
      }
      if (hasComps) entities.push(ent);
    }
    return entities;
  }

  private getComponentConstructor<T>(
    name: keyof typeof _components,
  ): typeof Component<T> {
    const comp = _components[name];
    return comp as typeof Component<T>;
  }

  private getIdList(ent: Entity, idList: number[] = []): number[] {
    idList.push(ent.id);
    for (const child of ent.children) {
      this.getIdList(child, idList);
    }
    return idList;
  }
}
