import { LuaEngine } from 'wasmoon';
import { Entity } from '../ecs/Entity';
import { Transform } from '../math/Transform';
import { ECS } from '../ecs/ECS';
import { Mesh } from '../render/mesh/Mesh';

export function setup_lua_util(lua: LuaEngine) {
  lua.global.set('get_time', () => {
    return Date.now();
  });

  lua.global.set('screen_size', { w: 1024, h: 768 });
}

export function setup_lua_entity_components(lua: LuaEngine, ecs: ECS) {
  lua.global.set('get_transform', (entity: Entity) => {
    const transComp = entity.getComponent<Transform>('Transform');
    if (transComp) {
      return transComp.data;
    }
  });

  lua.global.set('get_material', (entity: Entity) => {
    const meshComp = entity.getComponent<Mesh>('Mesh');
    if (meshComp) {
      return meshComp.data.material;
    }
  });

  lua.global.set('get_geometry', (entity: Entity) => {
    const meshComp = entity.getComponent<Mesh>('Mesh');
    if (meshComp) {
      return meshComp.data.geometry;
    }
  });

  lua.global.set('spawn_prefab', (name: string) => {
    return ecs.createPrefab(name);
  });

  lua.global.set('delete_entity', (entity: Entity) => {
    return ecs.deleteEntity(entity.id);
  });
}
