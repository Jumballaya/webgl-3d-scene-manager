import { ECS } from '../ecs/ECS';
import { LuaEngine } from 'wasmoon';
import { Entity } from '../ecs/Entity';
import { setup_lua_util } from './globals';

class Script<P extends Array<unknown>> {
  private manager: ScriptManager;
  private text: string;
  private fn: (entity: Entity, ...params: P) => void;

  constructor(manager: ScriptManager, text: string) {
    this.text = text;
    this.manager = manager;
    this.fn = manager.generateFunction(text);
  }

  public runScript(entity: Entity, ...params: P) {
    this.fn(entity, ...params);
  }

  public updateText(text: string) {
    this.text = text;
  }

  public compile() {
    this.fn = this.manager.generateFunction(this.text);
  }
}

// type ScriptData = {
//   update?: Script<[number]>; // entity, deltaTime
//   onClick?: Script<[number, vec2]>; // entity, mouse position
//   //onCollision?: Script<[Collision]> // entity, collision
// };

export class ScriptManager {
  private ecs: ECS;
  private lua: LuaEngine;

  private scripts: Map<string, Script<unknown[]>> = new Map();

  constructor(ecs: ECS, lua: LuaEngine) {
    this.ecs = ecs;
    this.lua = lua;
    setup_lua_util(this.lua);
  }

  public generateFunction(fn: string) {
    return this.lua.doStringSync(fn);
  }

  public addScript(name: string, text: string) {
    const script = new Script(this, text);
    this.scripts.set(name, script);
  }

  public getScript<T extends Array<unknown>>(name: string): Script<T> | null {
    return this.scripts.get(name) ?? null;
  }

  public scriptList(): string[] {
    return Array.from(this.scripts.keys());
  }
}
