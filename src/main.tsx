// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './App.tsx';
import './index.css';

import { AssetManager } from './renderer/assets/AssetManager';
import { ArcballCamera } from './renderer/controls/Arcball';
import { Controller } from './renderer/controls/Controller';
import { WebGL } from './renderer/gl/WebGL';
import { Camera } from './renderer/viewer/Camera';
import { Transform } from './renderer/math/Transform';
import { vec2 } from 'gl-matrix';
import { load_defaults } from './core/load_defaults';
import { LightManager } from './renderer/viewer/light/LightManager';
import { Renderer } from './Renderer';

// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
// );

async function main() {
  const size: vec2 = [1024, 768];
  const canvas = document.createElement('canvas');
  canvas.classList.add('m-auto', 'pt-32');
  canvas.width = size[0];
  canvas.height = size[1];
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('webgl2');
  if (!ctx) throw new Error('could not create webgl2 context');
  ctx.getExtension('EXT_color_buffer_float');
  const input = new ArcballCamera([0, 1, -5], [0, 0, 0], [0, 1, 0], 10, size);
  const controller = new Controller();
  input.registerController(controller);

  const webgl = new WebGL(ctx);
  webgl.enable('cull_face', 'depth', 'blend');
  const camera = new Camera(
    webgl,
    (Math.PI / 180) * 65,
    size[0],
    size[1],
    0.001,
    1000,
    input,
  );
  const assetManager = new AssetManager(webgl);
  await load_defaults(assetManager);
  webgl.registerController(controller);

  const gBufferShader = assetManager.getShader('g-buffer');
  if (!gBufferShader) throw new Error('could not find "g-buffer" shader');
  const lightShader = assetManager.getShader('lights');
  if (!lightShader) throw new Error('could not find "lights" shader');
  const screenShader = assetManager.getShader('screen');
  if (!screenShader) throw new Error('could not find "screen" shader');

  const renderer = new Renderer(
    webgl,
    size,
    lightShader,
    screenShader,
    assetManager,
  );
  renderer.setupUBO({
    material: [gBufferShader],
    model: [gBufferShader, lightShader, screenShader],
    lights: [lightShader],
  });
  camera.setupUBO([gBufferShader]);

  const objects: Transform[] = [];
  const geo = assetManager.getMesh('suzanne')!.geometry!;

  gBufferShader.bind();
  gBufferShader.uniform('u_texture_albedo', { type: 'texture', value: 16 });
  gBufferShader.unbind();

  for (let i = 0; i < 12; i++) {
    const trans = new Transform();
    trans.translation = [
      6 * Math.cos((Math.PI / 6) * i),
      0,
      6 * Math.sin((Math.PI / 6) * i),
    ];
    trans.rotation = [0, -Math.PI * i, 0];
    objects.push(trans);
  }

  const light = renderer.createLight('point');
  light.position = [0, 4, 0];

  renderer.createPostProcessStep(
    'sobel outline',
    `
    void make_kernel(inout vec4 n[9], sampler2D tex, vec2 coord)
    {
      float w = 1.0 / u_screensize[0];
      float h = 1.0 / u_screensize[1];
    
      n[0] = texture(tex, coord + vec2( -w, -h));
      n[1] = texture(tex, coord + vec2(0.0, -h));
      n[2] = texture(tex, coord + vec2(  w, -h));
      n[3] = texture(tex, coord + vec2( -w, 0.0));
      n[4] = texture(tex, coord);
      n[5] = texture(tex, coord + vec2(  w, 0.0));
      n[6] = texture(tex, coord + vec2( -w, h));
      n[7] = texture(tex, coord + vec2(0.0, h));
      n[8] = texture(tex, coord + vec2(  w, h));
    }

    void main(void) 
    {
      vec4 n[9];
      vec4 base = texture(u_texture, v_uv);
      make_kernel(n, u_texture, v_uv);
    
      vec4 sobel_edge_h = n[2] + (2.0*n[5]) + n[8] - (n[0] + (2.0*n[3]) + n[6]);
      vec4 sobel_edge_v = n[0] + (2.0*n[1]) + n[2] - (n[6] + (2.0*n[7]) + n[8]);
      vec4 sobel = sqrt((sobel_edge_h * sobel_edge_h) + (sobel_edge_v * sobel_edge_v));
    
      vec3 color = base.rgb / (1.0 - sobel.rgb / 3.0);
      outColor = vec4(color, base.a);
    }
  `,
  );

  const loop = () => {
    for (const trans of objects) {
      renderer.add(geo, gBufferShader, trans);
    }
    renderer.render(camera);

    requestAnimationFrame(loop);
  };
  loop();
}
main();
