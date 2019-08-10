import { NamedMacros } from '../client';

export function getAllCustomIngredients(): NamedMacros[] {
  return [];
/*   const ingreds: Ingredient[] = [];
  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i);
    if (key !== null && isIngredientKey(key)) {
      ingreds.push(loadIngredient(key));
    }
  }
  return ingreds.sort((l, r) => (l.name < r.name ? -1 : 1)); */
}

/* TODO change this to use RecipeIngredient */
export function getAllRecipes(): NamedMacros[] {
  return [];
/*   const recipes: Recipe[] = [];
  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i);
    if (key !== null && isRecipeKey(key)) {
      recipes.push(loadRecipe(key));
    }
  }
  return recipes.sort((l, r) => (l.name < r.name ? -1 : 1)); */
}
