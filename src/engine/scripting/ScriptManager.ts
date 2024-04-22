import { ECS } from '../ecs/ECS';
import { LuaEngine } from 'wasmoon';
import { setup_lua_entity_components, setup_lua_util } from './globals';
import { Script } from './Script';

export class ScriptManager {
  private ecs: ECS;
  private lua: LuaEngine;

  private scripts: Map<string, Script<unknown[]>> = new Map();

  constructor(ecs: ECS, lua: LuaEngine) {
    this.ecs = ecs;
    this.lua = lua;
    setup_lua_util(this.lua);
    setup_lua_entity_components(this.lua, this.ecs);
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
