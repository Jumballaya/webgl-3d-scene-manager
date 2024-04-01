import { AssetManager } from '@/renderer/assets/AssetManager';

import gridVert from '@/renderer/shaders/grid/vertex.glsl?raw';
import gridFrag from '@/renderer/shaders/grid/fragment.glsl?raw';

/// NEW STUFF

import gBufferVert from '@/renderer/shaders/test/gbuffer/vertex.glsl?raw';
import gBufferFrag from '@/renderer/shaders/test/gbuffer/fragment.glsl?raw';

import lightsVert from '@/renderer/shaders/test/lights/vertex.glsl?raw';
import lightsFrag from '@/renderer/shaders/test/lights/fragment.glsl?raw';

import screenVert from '@/renderer/shaders/test/screen/vertex.glsl?raw';
import screenFrag from '@/renderer/shaders/test/screen/fragment.glsl?raw';

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
      type: 'obj:network',
      name: 'suzanne',
      dir: 'models/suzanne/',
      file: 'suzanne.obj',
      shader: 'g-buffer',
    },
  ]);
}
