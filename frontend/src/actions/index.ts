import { makeIngredient, makeRecipe, FOOD_UNIT, Ingredient } from '../classes';
import {
  CREATE_INGREDIENT_TOGGLE,
  CREATE_INGREDIENT_SUBMIT,
  CREATE_RECIPE_OPEN,
  ADD_FOOD_TO_RECIPE,
  REMOVE_FOOD_FROM_RECIPE,
  CREATE_RECIPE_SUBMIT,
  SAVE_INGREDIENT,
  SELECT_DATASOURCE,
  FOODSEARCH_INPUT,
  FOODSEARCH_SUBMIT,
  ADD_FOOD_TO_MEAL,
  REMOVE_FOOD_FROM_MEAL,
  ADD_MEAL,
  REMOVE_MEAL,
  CHANGE_DAY
} from '../constants/index';
import { DataSource } from '../ndbapi';
import { IngredientSearchItem } from '../ndbapi/classes';
import { TopBitDisplay } from '../types';

interface Action<T extends string> {
  type: T;
}

interface ActionWithPayload<T extends string, P> extends Action<T> {
  payload: P;
}

function createAction<T extends string>(type: T): Action<T>;
function createAction<T extends string, P>(type: T, payload: P): ActionWithPayload<T, P>;
function createAction<T extends string, P>(type: T, payload?: P) {
  console.log('Creating action: ' + type + '\nwith payload: \n' + JSON.stringify(payload));
  // TODO was payload ?, but that failed with a payload of 0
  // is there a point to this check now?
  return payload !== undefined ? { type, payload } : { type };
}

function createIngredient(
  name: string,
  fat: number,
  carbs: number,
  protein: number,
  calories: number,
  amount: number,
  unit: FOOD_UNIT
) {
  const ingredient = makeIngredient(
    name, fat, carbs, protein, calories, amount, unit
  );
  return createAction(CREATE_INGREDIENT_SUBMIT, ingredient);
}

function addFoodToRecipe(ingredient: Ingredient) {
  return createAction(ADD_FOOD_TO_RECIPE, ingredient);
}

function removeFoodFromRecipe(foodIdx: number) {
  return createAction(REMOVE_FOOD_FROM_RECIPE, foodIdx);
}

function createRecipe(
  name: string, foods: Ingredient[], amount?: number, unit?: FOOD_UNIT
) {
  const recipe = makeRecipe(name, foods, amount, unit);
  return createAction(CREATE_RECIPE_SUBMIT, recipe);
}

function saveIngredient(ingredient: Ingredient) {
  return createAction(SAVE_INGREDIENT, ingredient);
}

// TODO should actions be UI-driven or business logic driven?
// perhaps business-driven and have the containers perform business/ui mapping?
export const actions = {
  selectDataSource:
    (dataSource: DataSource) => createAction(SELECT_DATASOURCE, dataSource),
  foodSearchInput:
    (searchString: string) => createAction(FOODSEARCH_INPUT, searchString),
  foodSearchSubmit:
    (items: IngredientSearchItem[]) => createAction(FOODSEARCH_SUBMIT, items),
  addMeal: () => createAction(ADD_MEAL),
  removeMeal: (mealIdx: number) => createAction(REMOVE_MEAL, mealIdx),
  addFoodToMeal:
    (food: Ingredient, mealIdx?: number) =>
      createAction(ADD_FOOD_TO_MEAL, { mealIdx, food }),
  removeFoodFromMeal:
    (mealIdx: number, food: Ingredient) =>
      createAction(REMOVE_FOOD_FROM_MEAL, { mealIdx, food }),
  createIngredientToggle: (destination: TopBitDisplay) => createAction(CREATE_INGREDIENT_TOGGLE, destination),
  createIngredientSubmit: createIngredient,
  createRecipeOpen: () => createAction(CREATE_RECIPE_OPEN),
  addFoodToRecipe: addFoodToRecipe,
  removeFoodFromRecipe: removeFoodFromRecipe,
  createRecipeSubmit: createRecipe,
  saveIngredient: saveIngredient,
  setDay: (day: Date) => createAction(CHANGE_DAY, day)
};

// tslint:disable-next-line:no-any
type FunctionType = (...args: any[]) => any;
type ActionsUnion<A extends { [ac: string]: FunctionType }> = ReturnType<A[keyof A]>;
export type Actions = ActionsUnion<typeof actions>;
