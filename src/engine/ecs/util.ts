export function isClonable(obj: unknown): obj is { clone: () => unknown } {
  if (typeof obj === 'string') return false;
  if (typeof obj === 'number') return false;
  if (typeof obj === 'boolean') return false;
  if (typeof obj === 'symbol') return false;
  if (typeof obj === 'bigint') return false;
  if (typeof obj === 'undefined') return false;
  if (obj instanceof Array) return false;
  if (obj instanceof Function) return false;
  if (obj === null) return false;
  if (Object.keys(obj).includes('clone')) return true;
  if (typeof obj === 'object') {
    return typeof (obj as Record<string, unknown>)['clone'] === 'function';
  }
  return false;
}
