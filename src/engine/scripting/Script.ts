import { Entity } from '../ecs/Entity';
import { ScriptManager } from './ScriptManager';

export class Script<P extends Array<unknown>> {
  private manager: ScriptManager;
  private source: string;
  private fn: (entity: Entity, ...params: P) => void;

  constructor(manager: ScriptManager, text: string) {
    this.source = text;
    this.manager = manager;
    this.fn = manager.generateFunction(text);
  }

  public runScript(entity: Entity, ...params: P) {
    this.fn(entity, ...params);
  }

  public updateText(text: string) {
    this.source = text;
  }

  public compile() {
    this.fn = this.manager.generateFunction(this.source);
  }

  public get text() {
    return this.source;
  }
}
