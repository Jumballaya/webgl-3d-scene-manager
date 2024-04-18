import { Renderer } from '@/renderer/viewer/Renderer';

export function apply_sobel(renderer: Renderer) {
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
}
