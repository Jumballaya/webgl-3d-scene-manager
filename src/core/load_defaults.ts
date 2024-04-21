import { AssetManager } from '@/engine/assets/AssetManager';

import gridVert from '@/engine/render/shaders/grid/vertex.glsl?raw';
import gridFrag from '@/engine/render/shaders/grid/fragment.glsl?raw';

import idVert from '@/engine/render/shaders/id/vertex.glsl?raw';
import idFrag from '@/engine/render/shaders/id/fragment.glsl?raw';

/// NEW STUFF

import gBufferVert from '@/engine/render/shaders/gbuffer/vertex.glsl?raw';
import gBufferFrag from '@/engine/render/shaders/gbuffer/fragment.glsl?raw';

import lightsVert from '@/engine/render/shaders/lights/vertex.glsl?raw';
import lightsFrag from '@/engine/render/shaders/lights/fragment.glsl?raw';

import screenVert from '@/engine/render/shaders/screen/vertex.glsl?raw';
import screenFrag from '@/engine/render/shaders/screen/fragment.glsl?raw';

///

export async function load_defaults(assetManager: AssetManager) {
  await assetManager.load([
    {
      type: 'shader:src',
      name: 'grid',
      vertex: gridVert,
      fragment: gridFrag,
    },
    {
      type: 'shader:src',
      name: 'g-buffer',
      vertex: gBufferVert,
      fragment: gBufferFrag,
    },
    {
      type: 'shader:src',
      name: 'lights',
      vertex: lightsVert,
      fragment: lightsFrag,
    },
    {
      type: 'shader:src',
      name: 'screen',
      vertex: screenVert,
      fragment: screenFrag,
    },
    {
      type: 'geometry:network',
      name: 'suzanne',
      dir: 'models/suzanne/',
      file: 'suzanne.obj',
    },
    { type: 'shader:src', name: 'grid', vertex: gridVert, fragment: gridFrag },
    { type: 'shader:src', name: 'id', vertex: idVert, fragment: idFrag },
    {
      type: 'script:network',
      name: 'player_update.lua',
      dir: 'scripts/player/',
      file: 'player_update.lua',
    },
    {
      type: 'script:network',
      name: 'player_collision.lua',
      dir: 'scripts/player/',
      file: 'player_collision.lua',
    },
    {
      type: 'script:network',
      name: 'enemy_update.lua',
      dir: 'scripts/enemies/',
      file: 'enemy_update.lua',
    },
    {
      type: 'script:network',
      name: 'enemy_spawner_update.lua',
      dir: 'scripts/enemies/',
      file: 'enemy_spawner_update.lua',
    },
  ]);
}
