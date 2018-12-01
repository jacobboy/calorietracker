import {
  makeScaledIngredient,
  makeRecipe,
  FOOD_UNIT,
  Ingredient,
  scaleFoodTo
} from '../classes';
import {
  CREATE_INGREDIENT_TOGGLE,
  CREATE_INGREDIENT_SUBMIT,
  CREATE_RECIPE_OPEN,
  ADD_FOOD_TO_RECIPE,
  ADD_FOODS_TO_RECIPE,
  REPLACE_FOOD_IN_RECIPE,
  REMOVE_FOOD_FROM_RECIPE,
  CREATE_RECIPE_SUBMIT,
  SAVE_INGREDIENT,
  SELECT_DATASOURCE,
  FOODSEARCH_INPUT,
  FOODSEARCH_SUBMIT,
  ADD_FOOD_TO_MEAL,
  REMOVE_FOOD_FROM_MEAL,
  REPLACE_FOOD_IN_MEAL,
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
  // console.log('Creating action: ' + type + '\nwith payload: \n' + JSON.stringify(payload));
  // TODO was payload ?, but that failed with a payload of 0
  // is there a point to this check now?
  return payload !== undefined ? { type, payload } : { type };
}

function addFoodToMeal(food: Ingredient, mealIdx: number) {
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
  const ingredient = makeScaledIngredient(
    name, fat, carbs, protein, calories, amount, convertAmount, unit
  );
  return createAction(CREATE_INGREDIENT_SUBMIT, ingredient);
}

function changeRecipeFoodAmount(food: Ingredient, newAmount: number) {
  const newFood = scaleFoodTo(food, newAmount);
  return createAction(REPLACE_FOOD_IN_RECIPE, {from: food, to: newFood});
}

function addFoodToRecipe(ingredient: Ingredient) {
  return createAction(ADD_FOOD_TO_RECIPE, ingredient);
}

function addFoodsToRecipe(ingredients: Ingredient[]) {
  return createAction(ADD_FOODS_TO_RECIPE, ingredients);
}

function removeFoodFromRecipe(food: Ingredient) {
  return createAction(REMOVE_FOOD_FROM_RECIPE, food);
}

function saveRecipe(
  name: string, foods: Ingredient[], portionSize: number, totalSize?: number, unit?: string
) {
  const recipe = makeRecipe(name, foods, portionSize, totalSize, unit);
  return createAction(CREATE_RECIPE_SUBMIT, recipe);
}

function saveIngredient(ingredient: Ingredient) {
  return createAction(SAVE_INGREDIENT, ingredient);
}

function changeMealFoodAmount(mealIdx: number, food: Ingredient, newAmount: number) {
  const newFood = scaleFoodTo(food, newAmount);
  return createAction(REPLACE_FOOD_IN_MEAL, {mealIdx, from: food, to: newFood});
}

/* function saveDay() {

} */

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
  changeMealFoodAmount,
  addFoodToMeal,
  removeFoodFromMeal:
    (mealIdx: number, food: Ingredient) =>
      createAction(REMOVE_FOOD_FROM_MEAL, { mealIdx, food }),
  createIngredientToggle: (destination: TopBitDisplay) => createAction(CREATE_INGREDIENT_TOGGLE, destination),
  createIngredientSubmit,
  createRecipeOpen: () => createAction(CREATE_RECIPE_OPEN),
  changeRecipeFoodAmount,
  addFoodToRecipe,
  addFoodsToRecipe,
  removeFoodFromRecipe,
  saveRecipe,
  saveIngredient,
  setDay: (day: Date) => createAction(CHANGE_DAY, day),
  /* saveDay */
};

// tslint:disable-next-line:no-any
type FunctionType = (...args: any[]) => any;
type ActionsUnion<A extends { [ac: string]: FunctionType }> = ReturnType<A[keyof A]>;
export type Actions = ActionsUnion<typeof actions>;
