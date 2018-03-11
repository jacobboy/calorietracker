import {
  ADD_INGREDIENT,
  ADD_RECIPE,
  SELECT_DATASOURCE,
  FOODSEARCH_INPUT,
  FOODSEARCH_SUBMIT,
  FOODDETAILS_CLICK,
  FOODTRACK_CLICK
} from '../constants/index';
import { DataSource } from '../ndbapi';
import { SearchListItem } from '../classes';

interface Action<T extends string> {
  type: T;
}

interface ActionWithPayload<T extends string, P> extends Action<T> {
  payload: P;
}

function createAction<T extends string>(type: T): Action<T>;
function createAction<T extends string, P>(type: T, payload: P): ActionWithPayload<T, P>;
function createAction<T extends string, P>(type: T, payload?: P) {
  return payload ? { type, payload } : { type };
}

export const actions = {
  selectDataSource: (dataSource: DataSource) => createAction(SELECT_DATASOURCE, dataSource),
  foodSearchInput: (searchString: string) => createAction(FOODSEARCH_INPUT, searchString),
  foodSearchSubmit: (items: SearchListItem[]) => createAction(FOODSEARCH_SUBMIT, items),
  foodDetailsClick: (ndbno: string) => createAction(FOODDETAILS_CLICK, ndbno),
  foodTrackClick: (ndbno: string) => createAction(FOODTRACK_CLICK, ndbno),
  addIngredient: () => createAction(ADD_INGREDIENT),
  addRecipe: () => createAction(ADD_RECIPE)
};

// tslint:disable-next-line:no-any
type FunctionType = (...args: any[]) => any;
type ActionsUnion<A extends { [ac: string]: FunctionType }> = ReturnType<A[keyof A]>;
export type Actions = ActionsUnion<typeof actions>;
