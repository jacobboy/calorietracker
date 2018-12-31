import { Ingredient, } from './classes';

/* TODO this is actually dumb, storage is just the "client" ?*/
export function sendIngredient(ingredient: Ingredient): void {
  // TODO how to test this?
  // should i just dependency inject a client object everywhere?
  const ingredStr = JSON.stringify(ingredient);
  window.localStorage.setItem(ingredient.uid, ingredStr);
}