import { VertexArray } from '@/engine/render/gl/VertexArray';

export class Geometry {
  protected vertexArray: VertexArray;
  public name: string;

  constructor(vao: VertexArray, name: string) {
    this.vertexArray = vao;
    this.name = name;
  }

  public clone(): Geometry {
    const m = new Geometry(this.vertexArray, this.name);
    return m;
  }

  public copy(m: Geometry) {
    const clone = m.clone();
    this.vertexArray = clone.vertexArray;
    this.name = clone.name;
  }

  public bind() {
    this.vertexArray.bind();
  }

  public unbind() {
    this.vertexArray.unbind();
  }

  public get vertexCount(): number {
    return this.vertexArray.vertexCount;
  }
}
