import { NamedMacros } from '../client';

function getKey(keyType: string) {
  // was '::' but Enzyme didn't like that
  return (id: string) => keyType + '_' + id;
}

function isKey(keyType: string) {
  return (key: string) => key.startsWith(keyType);
}

export const getNdbKey = getKey('ndbno');
export const isNdbKey = isKey('ndbno');
export const getIngredientKey = getKey('ingredient');
export const isIngredientKey = isKey('ingredient');
export const getAmountOfKey = getKey('amountof');
export const isAmountOfKey = isKey('amountof');
export const getRecipeKey = getKey('recipe');
export const isRecipeKey = isKey('recipe');
export const getMealKey = getKey('meal');
export const isMealKey = isKey('meal');
export const getDateKey = getKey('date');
export const isDateKey = isKey('date');

/* export function saveIngredient(ingredient: client.NewIngredient): void {
  // TODO unify this with CustomIngredient to avoid drift?
  client.DefaultApiFp().createIngredient(ingredient);
} */

/* export function saveRecipe(recipe: Recipe): void {
  const key = recipe.uid;
  const recipeStr = JSON.stringify(recipe);
  window.localStorage.setItem(key, recipeStr);
  // console.log('Saved recipe\n' + recipeStr);
} */

/* export function loadRecipe(recipeId: string): Recipe {
  const recipeStr = window.localStorage.getItem(recipeId);
  if (recipeStr) {
    // console.log('Retrieved ' + recipeId + ' from window storage');
    return recipeFromJson(recipeStr);
  } else {
    throw new Error('Recipe ' + recipeId + ' not found.');
  }
} */

/* export function loadRecipe(recipeId: string): Promise<Recipe> {
  // console.log('Retrieved ' + recipeId + ' from window storage');
  return new Promise((resolve, reject) => {
    const recipeStr = window.localStorage.getItem(recipeId);
    if (recipeStr !== null) {
      resolve(recipeFromJson(recipeStr));
    } else {
      reject(Error('Recipe ' + recipeId + ' not found.'));
    }
  });
} */

/* export function saveDay(date: MealDate, meals: Meal[]) {
  window.localStorage.setItem(date.id, JSON.stringify(meals));
} */

/* export function loadDay(date: MealDate) {
  const mealStr = window.localStorage.getItem(date.id) || '[]';
  return JSON.parse(mealStr);
} */

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
