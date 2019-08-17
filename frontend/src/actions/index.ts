import {
  CREATE_INGREDIENT_TOGGLE,
  CREATE_INGREDIENT_SUBMIT,
  CREATE_RECIPE_OPEN,
  ADD_FOOD_TO_RECIPE,
  ADD_FOODS_TO_RECIPE,
  REPLACE_FOOD_IN_RECIPE,
  REMOVE_FOOD_FROM_RECIPE,
  CREATE_RECIPE_SUBMIT,
  SAVE_SEARCH_ITEM,
  SELECT_DATASOURCE,
  FOODSEARCH_INPUT,
  FOODSEARCH_SUBMIT,
  ADD_FOOD_TO_MEAL,
  REMOVE_FOOD_FROM_MEAL,
  REPLACE_FOOD_IN_MEAL,
  ADD_MEAL,
  REMOVE_MEAL,
  CHANGE_DAY,
  CREATE_INGREDIENT_SUCCEEDED,
  FOODSEARCH_SUCCESS,
  COPY_RECIPE,
  CREATE_RECIPE_SUCCEEDED,
  LOAD_INGREDIENTS_SUBMIT,
  LOAD_RECIPES_SUBMIT,
  LOAD_INGREDIENTS_SUCCESS,
  LOAD_RECIPES_SUCCESS
} from '../constants/index';
import { TopBitDisplay } from '../types';
import { NamedMacros, AmountOfNamedMacros, NewIngredient, Recipe } from 'src/client';
import { FOOD_UNIT } from 'src/classes';
import { DataSource } from 'src/ndbapi';
import { SearchItem } from 'src/usdaclient';
import { macrosFromAmountOf } from 'src/transforms';

export interface Action<T extends string> {
  type: T;
}

export interface ActionWithPayload<T extends string, P> extends Action<T> {
  payload: P;
}

function createAction<T extends string>(type: T): Action<T>;
function createAction<T extends string, P>(type: T, payload: P): ActionWithPayload<T, P>;
function createAction<T extends string, P>(type: T, payload?: P) {
  // console.log('Creating action: ' + type + '\nwith payload: \n' + JSON.stringify(payload));
  // TODO was payload ?, but that failed with a payload of 0
  // is there a point to this check now?
  return payload !== undefined ? { type, payload } : { type };
}

function addFoodToMeal(food: AmountOfNamedMacros, mealIdx: number) {
  return createAction(ADD_FOOD_TO_MEAL, { mealIdx, food });
}

function createIngredientSubmit(
  name: string,
  fat: number,
  carbs: number,
  protein: number,
  calories: number,
  amount: number,
  convertAmount: number,
  unit: FOOD_UNIT,
) {
  const scaledMacros = macrosFromAmountOf(
    {protein, fat, carbs, calories}, amount, convertAmount
  );
  const ingredient: NewIngredient = {
    name,
    protein: scaledMacros.protein,
    fat: scaledMacros.fat,
    carbs: scaledMacros.carbs,
    calories: scaledMacros.calories,
    amount: convertAmount,
    unit
};
  return createAction(CREATE_INGREDIENT_SUBMIT, ingredient);
}

function changeRecipeFoodAmount(food: AmountOfNamedMacros, newAmount: number) {
  const newFood: AmountOfNamedMacros = {amount: newAmount, namedMacros: food.namedMacros};
  return createAction(REPLACE_FOOD_IN_RECIPE, {from: food, to: newFood});
}

function addFoodToRecipe(ingredient: AmountOfNamedMacros) {
  return createAction(ADD_FOOD_TO_RECIPE, ingredient);
}

function createRecipeSubmit(
  name: string, foods: AmountOfNamedMacros[], portionSize: number, amount: number, unit: string
) {
  return createAction(CREATE_RECIPE_SUBMIT, {name, foods, portionSize, amount, unit});
}

function changeMealFoodAmount(mealIdx: number, food: AmountOfNamedMacros, newAmount: number) {
  const newFood: AmountOfNamedMacros = {amount: newAmount, namedMacros: food.namedMacros};
  return createAction(REPLACE_FOOD_IN_MEAL, {mealIdx, from: food, to: newFood});
}

export const sagaActions = {
  loadIngredientsAndRecipes: () => createAction(LOAD_INGREDIENTS_SUBMIT),
  foodSearchSubmit: (searchString: String, ds: String) => createAction(FOODSEARCH_SUBMIT, {searchString, ds}),
  createIngredientSubmit,
  copyRecipe: (recipeUid: string) => createAction(COPY_RECIPE, recipeUid),
  saveRecipe: createRecipeSubmit,
};

// TODO should actions be UI-driven or business logic driven?
// perhaps business-driven and have the containers perform business/ui mapping?
export const actions = {
  ...sagaActions,
  loadIngredientsSucceeded: (namedMacros: NamedMacros[]) => createAction(LOAD_INGREDIENTS_SUCCESS, namedMacros),
  loadRecipesSucceeded: (namedMacros: NamedMacros[]) => createAction(LOAD_RECIPES_SUCCESS, namedMacros),
  selectDataSource: (dataSource: DataSource) => createAction(SELECT_DATASOURCE, dataSource),
  foodSearchInput: (searchString: string) => createAction(FOODSEARCH_INPUT, searchString),
  foodSearchSucceeded: (searchResults: SearchItem[]) => createAction(FOODSEARCH_SUCCESS, {searchResults}),
  addMeal: () => createAction(ADD_MEAL),
  removeMeal: (mealIdx: number) => createAction(REMOVE_MEAL, mealIdx),
  changeMealFoodAmount,
  addFoodToMeal,
  removeFoodFromMeal: (mealIdx: number, food: AmountOfNamedMacros) =>
      createAction(REMOVE_FOOD_FROM_MEAL, { mealIdx, food }),
  createIngredientToggle: (destination: TopBitDisplay) => createAction(CREATE_INGREDIENT_TOGGLE, destination),
  createIngredientSucceeded: (macros: NamedMacros) => createAction(CREATE_INGREDIENT_SUCCEEDED, macros),
  createRecipeOpen: () => createAction(CREATE_RECIPE_OPEN),
  changeRecipeFoodAmount,
  addFoodToRecipe,
  createRecipeSucceeded: (recipe: Recipe) => createAction(CREATE_RECIPE_SUCCEEDED, recipe),
  addFoodsToRecipe: (recipe: Recipe) => createAction(ADD_FOODS_TO_RECIPE, recipe),
  removeFoodFromRecipe: (food: AmountOfNamedMacros) => createAction(REMOVE_FOOD_FROM_RECIPE, food),
  saveSearchItem: (ingredient: NamedMacros) => createAction(SAVE_SEARCH_ITEM, ingredient),
  setDay: (day: Date) => createAction(CHANGE_DAY, day),
};

// tslint:disable-next-line:no-any
type FunctionType = (...args: any[]) => any;
type ActionsUnion<A extends { [ac: string]: FunctionType }> = ReturnType<A[keyof A]>;
export type Actions = ActionsUnion<typeof actions>;
export type ActionsTypeMap = { [P in keyof (typeof actions)]: ReturnType<(typeof actions)[P]> };

/*
This is actually good stuff
export enum Stuff {
  HI = 'HI',
  SUP = 'SUP'
}

export type STYPE = keyof typeof Stuff;
// tslint:disable-next-line:no-any
export type SactionsType = {[T in STYPE]: () => (Action<T> | ActionWithPayload<T, any>) };
export const Sactions: SactionsType = {
  HI: () => createAction(Stuff.HI, 'hi'),
  SUP: () => createAction(Stuff.SUP)
};

Until here, i think
export const sone = Sactions[Stuff.HI]; */

/* const allActions = [
  (dataSource: DataSource) => createAction(SELECT_DATASOURCE, dataSource),
  (searchString: string) => createAction(FOODSEARCH_INPUT, searchString),
  (items: IngredientSearchItem[]) => createAction(FOODSEARCH_SUBMIT, items),
  () => createAction(ADD_MEAL),
  (mealIdx: number) => createAction(REMOVE_MEAL, mealIdx),
  changeMealFoodAmount,
  addFoodToMeal,
  (mealIdx: number, food: AmountOfNamedMacros) => createAction(REMOVE_FOOD_FROM_MEAL, { mealIdx, food }),
  (destination: TopBitDisplay) => createAction(CREATE_INGREDIENT_TOGGLE, destination),
  createIngredientSubmit,
  () => createAction(CREATE_RECIPE_OPEN),
  changeRecipeFoodAmount,
  addFoodToRecipe,
  addFoodsToRecipe,
  removeFoodFromRecipe,
  saveRecipe,
  saveIngredient,
  (day: Date) => createAction(CHANGE_DAY, day),
];

export type ActionsTypeMap2 = { [P in keyof (typeof actions)]: ReturnType<(typeof actions)[P]>['type'] };

export type ActionNames = ReturnType<(typeof actions)[keyof (typeof actions)]>['type'];
export type y<A extends { [ac: string]: FunctionType }> = {[P in keyof A]: ReturnType<A[P]>};

export type AllActionTypes = ReturnType<(typeof allActions[0])>;
export type AllActionNames = AllActionTypes['type'];
// export type AllActionNames = 'ADD_MEAL' | 'REMOVE_MEAL';

// tslint:disable-next-line:no-any
export type waattt = { [P in AllActionNames]: (Action<P>) };
export const map: waattt = {
  SELECT_DATASOURCE: true,
  FOODSEARCH_INPUT: true,
  FOODSEARCH_SUBMIT: true,
  ADD_MEAL: true,
  REMOVE_MEAL: true,
  REPLACE_FOOD_IN_MEAL: true,
  ADD_FOOD_TO_MEAL: true,
  REMOVE_FOOD_FROM_MEAL: true,
  CREATE_INGREDIENT_TOGGLE: true,
  CREATE_INGREDIENT_SUBMIT: true,
  CREATE_RECIPE_OPEN: true,
  REPLACE_FOOD_IN_RECIPE: true,
  ADD_FOOD_TO_RECIPE: true,
  ADD_FOODS_TO_RECIPE: true,
  REMOVE_FOOD_FROM_RECIPE: true,
  CREATE_RECIPE_SUBMIT: true,
  SAVE_INGREDIENT: true,
  CHANGE_DAY: true
 };

type Keys = 'option1' | 'option2';
export type Flags = { [K in Keys]: boolean };
export const F: Flags = {
  option1: true,
  option2: true
}; */