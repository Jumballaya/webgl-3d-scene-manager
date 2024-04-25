type Binding = {
  action: string;
  keys: string[];
  onKeyDown: (time: number) => void;
  onKeyUp: (deltaTime: number) => void;
};

type BindingsOptions = {
  bindings: Binding[];
};

export class Bindings {
  private bindingsByKey: Map<string, Binding> = new Map();
  private bindingsByAction: Map<string, Binding> = new Map();

  constructor(opts: BindingsOptions) {
    for (let i = 0; i < opts.bindings.length; i++) {
      const binding = opts.bindings[i];
      this.bindingsByKey.set(binding.keys.join(''), binding);
      this.bindingsByAction.set(binding.action, binding);
    }
  }

  public bind(binding: Binding) {
    this.bindingsByKey.set(binding.keys.join(''), binding);
    this.bindingsByAction.set(binding.action, binding);
  }

  public unbindKey(keys: string[]) {
    const binding = this.bindingsByKey.get(keys.join(''));
    if (!binding) return;

    this.bindingsByKey.delete(keys.join());
    this.bindingsByAction.delete(binding.action);
  }

  public unbindAction(action: string) {
    const binding = this.bindingsByAction.get(action);
    if (!binding) return;

    this.bindingsByKey.delete(binding.keys.join(''));
    this.bindingsByAction.delete(action);
  }

  public actionIsBound(action: string): boolean {
    const binding = this.bindingsByAction.get(action);
    return !!binding;
  }

  public getBindingByAction(action: string): Binding | undefined {
    return this.bindingsByAction.get(action);
  }

  public keyIsBound(keys: string[]): boolean {
    const binding = this.bindingsByKey.get(keys.join(''));
    return !!binding;
  }

  public getBindingByKey(keys: string[]): Binding | undefined {
    return this.bindingsByKey.get(keys.join(''));
  }
}
