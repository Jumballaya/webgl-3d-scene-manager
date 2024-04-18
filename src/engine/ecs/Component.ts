import { Transform } from '@/engine/math/Transform';
import { Mesh } from '@/engine/render/mesh/Mesh';
import { Light } from '@/engine/render/light/Light';

export class Component<T> {
  public static name = 'Component';
  public data: T;
  constructor(data: T) {
    this.data = data;
  }

  public serialize(): [string, T] {
    return [this.constructor.name, this.data];
  }
}

export class NameComponent extends Component<string> {
  public static name = 'Name';
}

export class TransformComponent extends Component<Transform> {
  public static name = 'Transform';
}

export class MeshComponent extends Component<Mesh> {
  public static name = 'Mesh';
}

export class LightComponent extends Component<Light> {
  public static name = 'Light';
}
