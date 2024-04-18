import { AssetManager } from '@/renderer/assets/AssetManager';

import gridVert from '@/renderer/shaders/grid/vertex.glsl?raw';
import gridFrag from '@/renderer/shaders/grid/fragment.glsl?raw';

import idVert from '@/renderer/shaders/id/vertex.glsl?raw';
import idFrag from '@/renderer/shaders/id/fragment.glsl?raw';

/// NEW STUFF

import gBufferVert from '@/renderer/shaders/gbuffer/vertex.glsl?raw';
import gBufferFrag from '@/renderer/shaders/gbuffer/fragment.glsl?raw';

import lightsVert from '@/renderer/shaders/lights/vertex.glsl?raw';
import lightsFrag from '@/renderer/shaders/lights/fragment.glsl?raw';

import screenVert from '@/renderer/shaders/screen/vertex.glsl?raw';
import screenFrag from '@/renderer/shaders/screen/fragment.glsl?raw';

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
  ]);
}
