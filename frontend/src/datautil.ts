import { Named } from './classes';

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

export function toTitleCase(str: string) {
  const strs = str.toLowerCase().split(' ');
  for (var i = 0; i < strs.length; i++) {
    strs[i] = strs[i].charAt(0).toUpperCase() + strs[i].slice(1);
  }
  return strs.join(' ');
}

export function nameMatches<T extends Named>(nameds: T[], searchText: string) {
  // TODO should this become a method on Named
  const filters = searchText.split(' ');
  if (searchText) {
    return nameds.filter(
      ingred => filters.map(
        filter => ingred.name.toLowerCase().indexOf(filter.toLowerCase()) > -1
      ).every(x => x)
    );
  } else {
    return nameds;
  }
}