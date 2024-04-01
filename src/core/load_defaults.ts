import { AssetManager } from '@/renderer/assets/AssetManager';

import gridVert from '@/renderer/shaders/grid/vertex.glsl?raw';
import gridFrag from '@/renderer/shaders/grid/fragment.glsl?raw';

import lightsOldVert from '@/renderer/shaders/lights/vertex.glsl?raw';
import lightsOldFrag from '@/renderer/shaders/lights/fragment.glsl?raw';

import idVert from '@/renderer/shaders/id/vertex.glsl?raw';
import idFrag from '@/renderer/shaders/id/fragment.glsl?raw';

import screenOldVert from '@/renderer/shaders/screen/vertex.glsl?raw';
import screenOldFrag from '@/renderer/shaders/screen/fragment.glsl?raw';

/// NEW STUFF

import gBufferVert from '@/renderer/shaders/test/gbuffer/vertex.glsl?raw';
import gBufferFrag from '@/renderer/shaders/test/gbuffer/fragment.glsl?raw';

import lightsNewVert from '@/renderer/shaders/test/lights/vertex.glsl?raw';
import lightsNewFrag from '@/renderer/shaders/test/lights/fragment.glsl?raw';

import screenNewVert from '@/renderer/shaders/test/screen/vertex.glsl?raw';
import screenNewFrag from '@/renderer/shaders/test/screen/fragment.glsl?raw';

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
      name: 'lights_new',
      vertex: lightsNewVert,
      fragment: lightsNewFrag,
    },
    {
      type: 'shader:src',
      name: 'lights',
      vertex: lightsOldVert,
      fragment: lightsOldFrag,
    },
    {
      type: 'shader:src',
      name: 'screen_new',
      vertex: screenNewVert,
      fragment: screenNewFrag,
    },
    {
      type: 'obj:network',
      name: 'suzanne',
      dir: 'models/suzanne/',
      file: 'suzanne.obj',
      shader: 'g-buffer',
    },
    {
      type: 'shader:src',
      name: 'screen',
      vertex: screenOldVert,
      fragment: screenOldFrag,
    },
    { type: 'shader:src', name: 'grid', vertex: gridVert, fragment: gridFrag },
    { type: 'shader:src', name: 'id', vertex: idVert, fragment: idFrag },
  ]);
}
