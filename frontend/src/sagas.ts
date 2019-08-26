import { all, call, put, takeLatest } from 'redux-saga/effects';
import { DefaultApiFp as MacroMacroFp, NamedMacros, Recipe, AmountOfNamedMacros, DefaultApi } from './client';
import { DefaultApi as UsdaClient, SearchResponse, SearchDsEnum } from './usdaclient';
import { ActionsTypeMap, actions } from './actions';
import {
  CREATE_INGREDIENT_FAILED,
  CREATE_INGREDIENT_SUBMIT,
  CREATE_RECIPE_SUBMIT,
  COPY_RECIPE,
  FOODSEARCH_SUBMIT,
  FOODSEARCH_FAILED,
  LOAD_INGREDIENTS_FAILED,
  LOAD_INGREDIENTS_SUBMIT,
  LOAD_RECIPES_FAILED,
  LOAD_INGREDIENTS_SUCCESS,
  LOAD_RECIPES_SUCCESS,
  SAVE_SEARCH_ITEM,
  SAVE_SEARCH_ITEM_FAILED
} from './constants';
import { GOV_API_KEY } from './apikey';
import { macrosFromFood, DataSource } from './ndbapi';

// TODO How am I supposed to test sagas without exporting them all?
// attempts to test the root saga have failed so far

export function* loadInitialIngredients() {
  try {
    const macros: NamedMacros[] = yield call(MacroMacroFp().findIngredients());
    yield put({ type: LOAD_INGREDIENTS_SUCCESS, payload: macros });
  } catch (response) {
    yield put({ type: LOAD_INGREDIENTS_FAILED, payload: response.message });
  }
}

export function* loadInitialRecipes() {
  try {
    const macros: NamedMacros[] = yield call(MacroMacroFp().findRecipes());
    yield put({ type: LOAD_RECIPES_SUCCESS, payload: macros });
  } catch (response) {
    yield put({ type: LOAD_RECIPES_FAILED, payload: response.message });
  }
}

function* loadInitialIngredientsAndRecipes() {
  yield all([
    loadInitialIngredients(),
    loadInitialRecipes()
  ]);
}

function* createIngredient(action: ActionsTypeMap['createIngredientSubmit']) {
  try {
    const macros: NamedMacros = yield call(MacroMacroFp().createIngredient(action.payload));
    yield put(actions.createIngredientSucceeded(macros));
  } catch (response) {
    yield put({ type: CREATE_INGREDIENT_FAILED, payload: response.message });
  }
}

export function* searchFood(action: ActionsTypeMap['foodSearchSubmit']) {

  let searchRequest: {apiKey: string, q: string, ds?: SearchDsEnum};
  if (action.payload.ds === DataSource.Any) {
    searchRequest = {apiKey: GOV_API_KEY, q: action.payload.searchString};
  } else {
    const ds = action.payload.ds === DataSource.BL ? SearchDsEnum.BrandedFoodProducts : SearchDsEnum.StandardReference;
    searchRequest = {apiKey: GOV_API_KEY, q: action.payload.searchString, ds};
  }
  const searchFunc = (
    searchReq: {apiKey: string, q: string, ds?: SearchDsEnum}
  ) => (new UsdaClient()).search(searchRequest);

  try {
    const searchResults: SearchResponse = yield call(searchFunc, searchRequest);
    yield put(actions.foodSearchSucceeded(searchResults.list.item));
  } catch (response) {
    /* TODO ...usda doesn't 400 actually, just a search that _says_ 400
       unfortunately, it looks like ATM the client generator doesn't handle oneoF
       How to handle the error response? */
    yield put(actions.foodSearchFailed());
  }
}

function* copyRecipe(action: ActionsTypeMap['copyRecipe']) {
  const recipe: Recipe = yield call(MacroMacroFp().findRecipeByUID(action.payload));
  yield put(actions.addFoodsToRecipe(recipe));
}

function namedMacroToIngredient(nm: AmountOfNamedMacros) {
  return {uid: nm.namedMacros.uid, amount: nm.amount};
}

function* saveRecipe(action: ActionsTypeMap['saveRecipe']) {
  const recipe = yield call(
    MacroMacroFp().createRecipe({
      name: action.payload.name,
      foods: action.payload.foods.map(namedMacroToIngredient),
      portionSize: action.payload.portionSize,
      amount: action.payload.amount,
      unit: action.payload.unit
    })
  );
  yield actions.createRecipeSucceeded(recipe);
}

function* saveSearchItem(action: ActionsTypeMap['saveSearchItem']) {
  try {
    // little hack
    const uid = `ndbno::v1::${action.payload}`;
    const namedMacros = yield call(MacroMacroFp().findIngredientByUID(uid));
    yield put(actions.saveSearchItemSucceeded(namedMacros));
  } catch (response) {
    console.log(response.message);
    yield put({type: SAVE_SEARCH_ITEM_FAILED, payload: response.message});
  }
}

/* function* taker<T extends string, V>(f: (ActionWithPayload<T, V>) => ) {
  const z: string = CREATE_INGREDIENT_SUBMIT;
  yield takeLatest(CREATE_INGREDIENT_SUBMIT, f);
} */

export default function* rootSaga() {
  yield all([
    takeLatest(LOAD_INGREDIENTS_SUBMIT, loadInitialIngredientsAndRecipes),
    takeLatest(FOODSEARCH_SUBMIT, searchFood),
    takeLatest(CREATE_INGREDIENT_SUBMIT, createIngredient),
    takeLatest(COPY_RECIPE, copyRecipe),
    takeLatest(CREATE_RECIPE_SUBMIT, saveRecipe),
    takeLatest(SAVE_SEARCH_ITEM, saveSearchItem)
  ]);
}
