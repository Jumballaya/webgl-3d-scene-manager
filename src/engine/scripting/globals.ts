import { LuaEngine } from 'wasmoon';

export function setup_lua_util(lua: LuaEngine) {
  lua.global.set('get_time', () => {
    return Date.now();
  });

  lua.global.set('screen_size', { w: 1024, h: 768 });
}
