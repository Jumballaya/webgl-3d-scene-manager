import { Component } from './Component';

export type SerializedEntity = {
  id: number;
  components: Array<[string, unknown]>;
  children: SerializedEntity[];
};

let id = 0;
export class Entity {
  public id = id++;
  public components: Component<unknown>[] = [];
  public _children: Set<Entity> = new Set();

  public get componentList() {
    return this.components.map((c) => c.constructor.name).sort();
  }

  public getComponent<T>(name: string): Component<T> | null {
    const filtered = this.components.filter((c) => c.constructor.name === name);
    if (filtered.length === 0) return null;
    if (filtered.length > 1)
      throw new Error(`more than one "${name}" component on entity`);
    return filtered[0] as Component<T>;
  }

  public attachComponent(c: Component<unknown>) {
    this.components.push(c);
  }

  public removeComponent(name: string) {
    const idx = this.components.findIndex((c) => c.constructor.name === name);
    if (idx !== -1) {
      this.components = this.components
        .slice(0, idx)
        .concat(this.components.slice(idx + 1));
    }
  }

  public hasComponent(name: string) {
    return this.components.some((c) => c.constructor.name === name);
  }

  public get children(): Entity[] {
    return Array.from(this._children);
  }

  public set children(list: Entity[]) {
    this._children = new Set(list);
  }

  public addChild(child: Entity) {
    this._children.add(child);
  }

  public removeChild(child: Entity) {
    this._children.delete(child);
  }

  public purgeChildrenById(ids: number[]) {
    for (const id of ids) {
      for (const child of this.children) {
        if (child.id === id) {
          this.removeChild(child);
        }
      }
    }
  }

  public serialize(seen?: Set<number>): SerializedEntity {
    seen?.add(this.id);
    return {
      id: this.id,
      components: this.components.map((c) => c.serialize()),
      children: this.children.map((c) => c.serialize(seen)),
    };
  }
}
