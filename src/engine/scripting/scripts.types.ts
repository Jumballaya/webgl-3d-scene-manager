import { vec2 } from 'gl-matrix';
import { Script } from '@/engine/scripting/Script';

export type ScriptData = {
  update?: Script<[number]>; // entity, deltaTime
  onClick?: Script<[number, vec2]>; // entity, mouse position
  //onCollision?: Script<[Collision]> // entity, collision
};
