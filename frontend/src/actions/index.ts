import { Food } from '../classes';
import {
  CREATE_INGREDIENT,
  CREATE_RECIPE,
  SELECT_DATASOURCE,
  FOODSEARCH_INPUT,
  FOODSEARCH_SUBMIT,
  FOODDETAILS_CLICK,
  FOODTRACK_CLICK,
  CLOSE_TRACKING_MODAL,
  ADD_FOOD_TO_MEAL,
  REMOVE_FOOD_FROM_MEAL,
  ADD_MEAL,
  REMOVE_MEAL,
  CHANGE_DAY
} from '../constants/index';
import { DataSource } from '../ndbapi';
import { SearchListItem } from '../ndbapi/classes';

interface Action<T extends string> {
  type: T;
}

interface ActionWithPayload<T extends string, P> extends Action<T> {
  payload: P;
}

function createAction<T extends string>(type: T): Action<T>;
function createAction<T extends string, P>(type: T, payload: P): ActionWithPayload<T, P>;
function createAction<T extends string, P>(type: T, payload?: P) {
  // console.log('Creating action: ' + type);
  // console.log('With payload: \n' + JSON.stringify(payload));
  // TODO was payload ?, but that failed with a payload of 0
  // is there a point to this check now?
  return payload !== undefined ? { type, payload } : { type };
}

// TODO should actions be UI-driven or business logic driven?
// perhaps business-driven and have the containers perform business/ui mapping?
export const actions = {
  selectDataSource: (dataSource: DataSource) => createAction(SELECT_DATASOURCE, dataSource),
  foodSearchInput: (searchString: string) => createAction(FOODSEARCH_INPUT, searchString),
  foodSearchSubmit: (items: SearchListItem[]) => createAction(FOODSEARCH_SUBMIT, items),
  foodDetailsClick: (ndbno: string) => createAction(FOODDETAILS_CLICK, ndbno),
  foodTrackClick: (ingredientId: string, mealIdx?: number) => createAction(FOODTRACK_CLICK, { ingredientId, mealIdx }),
  closeTrackingModal: () => createAction(CLOSE_TRACKING_MODAL),
  addMeal: () => createAction(ADD_MEAL),
  removeMeal: (mealIdx: number) => createAction(REMOVE_MEAL, mealIdx),
  addFoodToMeal: (mealIdx: number, food: Food) => createAction(ADD_FOOD_TO_MEAL, { mealIdx, food }),
  removeFoodFromMeal: (mealIdx: number, food: Food) => createAction(REMOVE_FOOD_FROM_MEAL, { mealIdx, food }),
  createIngredient: () => createAction(CREATE_INGREDIENT),
  createRecipe: () => createAction(CREATE_RECIPE),
  setDay: (day: Date) => createAction(CHANGE_DAY, day)
};

// tslint:disable-next-line:no-any
type FunctionType = (...args: any[]) => any;
type ActionsUnion<A extends { [ac: string]: FunctionType }> = ReturnType<A[keyof A]>;
export type Actions = ActionsUnion<typeof actions>;
