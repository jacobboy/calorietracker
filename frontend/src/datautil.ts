export function dropIndex<T>(arr: Array<T>, idx: number): Array<T> {
  return [...arr.slice(0, idx), ...arr.slice(idx + 1)];
}

export function replaceElement<T>(arr: Array<T>, idx: number, el: T) {
  return [...arr.slice(0, idx), el, ...arr.slice(idx + 1)];
}
