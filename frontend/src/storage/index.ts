import { Report } from '../ndbapi/classes';
import { Ingredient, CustomIngredient, Recipe, ingredientFromReport } from '../classes';

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
export const getRecipeKey = getKey('recipe');
export const isRecipeKey = isKey('recipe');
export const getMealKey = getKey('meal');
export const isMealKey = isKey('meal');

export function saveReport(ndbno: string, report: Report): void {
  window.localStorage.setItem(getNdbKey(ndbno), JSON.stringify(report));
}

export function loadReport(ndbno: string): Report | null {
  const key = getNdbKey(ndbno);
  return loadReportFromKey(key);
}

function loadReportFromKey(key: string): Report | null {
  const reportStr: string | null = window.localStorage.getItem(key);
  if (reportStr !== null) {
    console.log('Retrieved ' + key + ' from window storage');
    return JSON.parse(reportStr);
  } else {
    return null;
  }
}

export function saveIngredient(ingredient: CustomIngredient): void {
  const key = getIngredientKey(ingredient.uid);
  const ingredStr = JSON.stringify(ingredient);
  window.localStorage.setItem(key, ingredStr);
  console.log('Saved ingredient\n' + ingredStr);
}

export function loadIngredient(ingredientId: string): Ingredient {
  const key = getIngredientKey(ingredientId);
  const ingredStr = window.localStorage.getItem(key);
  if (ingredStr !== null) {
    console.log('Retrieved ' + key + ' from window storage');
    return CustomIngredient.fromJson(ingredStr);
  } else {
    throw new Error('Ingredient ' + key + ' not found.');
  }
}

export function saveRecipe(recipe: Recipe): void {
  const key = getRecipeKey(recipe.uid);
  const recipeStr = JSON.stringify(recipe);
  window.localStorage.setItem(key, recipeStr);
  console.log('Saved recipe\n' + recipeStr);
}

export function loadRecipe(recipeId: string): Recipe {
  const key = getRecipeKey(recipeId);
  const recipeStr = window.localStorage.getItem(key);
  if (recipeStr !== null) {
    console.log('Retrieved ' + key + ' from window storage');
    return Recipe.fromJson(recipeStr);
  } else {
    throw new Error('Recipe ' + key + ' not found.');
  }
}

export function getAllStoredIngredients(): Ingredient[] {
  const ingreds: Ingredient[] = [];
  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i);
    if (key !== null && isNdbKey(key)) {
      const report = loadReportFromKey(key);
      if (report !== null) {
        ingreds.push(ingredientFromReport(report));
      }
    }
  }
  return ingreds;
}

export function getAllCustomIngredients(): Ingredient[] {
  const ingreds: Ingredient[] = [];
  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i);
    if (key !== null && isIngredientKey(key)) {
      const ingred = window.localStorage.getItem(key);
      if (ingred !== null) {
        ingreds.push(CustomIngredient.fromJson(ingred));
      }
    }
  }
  return ingreds;
}

export function getAllRecipes(): Recipe[] {
  const recipes: Recipe[] = [];
  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i);
    if (key !== null && isRecipeKey(key)) {
      const ingred = window.localStorage.getItem(key);
      if (ingred !== null) {
        recipes.push(Recipe.fromJson(ingred));
      }
    }
  }
  return recipes;
}
