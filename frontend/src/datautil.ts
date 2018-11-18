export function dropIndex<T>(arr: Array<T>, idx: number): Array<T> {
  return [...arr.slice(0, idx), ...arr.slice(idx + 1)];
}

export function replaceElement<T>(arr: Array<T>, idx: number, el: T) {
  return [...arr.slice(0, idx), el, ...arr.slice(idx + 1)];
}

export function replaceObject<T>(arr: Array<T>, oldObj: T, newObj: T) {
  // TODO eh could do this with indexOf and replaceElement
  function replace(obj: T) {
    return obj === oldObj ? newObj : obj;
  }
  return arr.map(replace);
}

export function currentDate() {
  const date = new Date();
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear().toString().substring(2)}`;
}