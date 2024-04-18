import { vec2 } from 'gl-matrix';
import { Texture } from './Texture';

type AttachmentType = 'color' | 'depth' | 'stencil';
type Attachment = {
  type: AttachmentType;
  size: vec2;
};

interface FrameBufferTextures {
  color: Array<Texture>;
  depth: Texture | undefined;
  stencil: Texture | undefined;
}

export class FrameBuffer {
  private buffer: WebGLFramebuffer;
  private ctx: WebGL2RenderingContext;
  private texOffset: number;

  private textures: FrameBufferTextures = {
    color: [],
    depth: undefined,
    stencil: undefined,
  };

  constructor(ctx: WebGL2RenderingContext, texOffset: number) {
    const buffer = ctx.createFramebuffer();
    if (!buffer) throw new Error('could not create frame buffer');
    this.buffer = buffer;
    this.texOffset = texOffset;

    if (
      ctx.checkFramebufferStatus(ctx.FRAMEBUFFER) !== ctx.FRAMEBUFFER_COMPLETE
    ) {
      throw new Error('frame buffer attachments error');
    }
    this.ctx = ctx;
  }

  public attachment(attachment: Attachment) {
    if (attachment.type === 'color') {
      this.createColorAttachment(attachment.size);
      return;
    }
    if (attachment.type === 'depth' && this.textures.depth === undefined) {
      this.createDepthAttachment(attachment.size);
      return;
    }
    if (attachment.type === 'stencil' && this.textures.stencil === undefined) {
      return;
    }
  }

  public unbindTextures() {
    for (let i = 0; i < this.textures.color.length; i++) {
      const tex = this.textures.color[i];
      tex.unbind();
    }
  }

  public bind() {
    this.ctx.bindFramebuffer(this.ctx.FRAMEBUFFER, this.buffer);
    for (let i = 0; i < this.textures.color.length; i++) {
      const tex = this.textures.color[i];
      tex.bind(this.texOffset + i);
    }
  }

  public unbind() {
    this.ctx.bindFramebuffer(this.ctx.FRAMEBUFFER, null);
  }

  public getDrawBuffers() {
    const len = this.textures.color.length;
    const out: number[] = [];
    for (let i = 0; i < this.texOffset; i++) {
      out.push(this.ctx.NONE);
    }
    for (let i = 0; i < len; i++) {
      out.push(this.ctx.COLOR_ATTACHMENT0 + i + this.texOffset);
    }
    return out;
  }

  public getColorTexture() {
    return this.textures.color;
  }

  public getDepthTexture() {
    return this.textures.depth;
  }

  public getStencilTexture() {
    return this.textures.stencil;
  }

  private createColorAttachment(size: vec2) {
    const ctx = this.ctx;
    const texture = new Texture(ctx, size, {
      internalFormat: ctx.RGBA16F,
    });
    texture.bind();
    ctx.bindFramebuffer(ctx.FRAMEBUFFER, this.buffer);
    ctx.framebufferTexture2D(
      ctx.FRAMEBUFFER,
      ctx.COLOR_ATTACHMENT0 + this.textures.color.length + this.texOffset,
      ctx.TEXTURE_2D,
      texture.getTexture(),
      0,
    );
    texture.unbind();

    this.textures.color.push(texture);
  }

  private createDepthAttachment(size: vec2) {
    const ctx = this.ctx;
    const texture = new Texture(ctx, size, {
      internalFormat: ctx.DEPTH_COMPONENT24,
      format: ctx.DEPTH_COMPONENT,
      type: ctx.UNSIGNED_INT,
    });
    ctx.bindFramebuffer(ctx.FRAMEBUFFER, this.buffer);
    ctx.framebufferTexture2D(
      ctx.FRAMEBUFFER,
      ctx.DEPTH_ATTACHMENT,
      ctx.TEXTURE_2D,
      texture.getTexture(),
      0,
    );

    this.textures.depth = texture;
  }
}
