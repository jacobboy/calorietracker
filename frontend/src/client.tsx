import { Ingredient } from './classes';

export function sendIngredient(ingredient: Ingredient): void {
  // TODO how to test this?
  // should i just dependency inject a client object everywhere?
  const ingredStr = JSON.stringify(ingredient);
  window.localStorage.setItem(ingredient.uid, ingredStr);
}
