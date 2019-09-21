import { all, call, put } from 'redux-saga/effects';
import { DefaultApi as MacroMacro, NamedMacros, Recipe, AmountOfNamedMacros, Configuration, InlineResponse200 } from './client';
import { DefaultApi as UsdaClient, SearchResponse, SearchDsEnum } from './usdaclient';
import { ActionsTypeMap, actions } from './actions';
import {
  CREATE_INGREDIENT_FAILED,
  CREATE_INGREDIENT_SUBMIT,
  CREATE_RECIPE_SUBMIT,
  COPY_RECIPE,
  FOODSEARCH_SUBMIT,
  LOAD_INGREDIENTS_FAILED,
  LOAD_INGREDIENTS_SUBMIT,
  LOAD_RECIPES_FAILED,
  LOAD_INGREDIENTS_SUCCESS,
  LOAD_RECIPES_SUCCESS,
  SAVE_SEARCH_ITEM,
  SAVE_SEARCH_ITEM_FAILED
} from './constants';
import { DataSource } from './ndbapi';
import { takeLeading } from './sagahelpers';

// TODO How am I supposed to test sagas without exporting them all?
// attempts to test the root saga have failed so far

function macroMacro() {
  return new MacroMacro(new Configuration({ basePath: process.env.REACT_APP_MACROMACRO_HOST! }));
}

export function* loadInitialIngredients() {
  const fn: () => Promise<NamedMacros[]> = () => macroMacro().findIngredients({});
  try {
    // TODO this complains about undefined when i `yield call(fn)`
    const macros: NamedMacros[] = yield call(fn);
    yield put({ type: LOAD_INGREDIENTS_SUCCESS, payload: macros });
  } catch (response) {
    console.log(response.message);
    yield put({ type: LOAD_INGREDIENTS_FAILED, payload: response.message });
  }
}

export function* loadInitialRecipes() {
  try {
    const fn = () => macroMacro().findRecipes({});
    const macros: NamedMacros[] = yield call(fn);
    yield put({ type: LOAD_RECIPES_SUCCESS, payload: macros });
  } catch (response) {
    console.log(response.message);
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
    const fn = () => macroMacro().createIngredient({ newIngredient: action.payload });
    const macros: NamedMacros = yield call(fn);
    yield put(actions.createIngredientSucceeded(macros));
  } catch (response) {
    console.log(response.message);
    yield put({ type: CREATE_INGREDIENT_FAILED, payload: response.message });
  }
}

export function* searchUsdaForFood(action: ActionsTypeMap['foodSearchSubmit']) {
  // TODO move this logic to ndbapi module
  const GOV_API_KEY = process.env.REACT_APP_GOV_API_KEY!;
  let searchRequest: { apiKey: string, q: string, ds?: SearchDsEnum };
  if (action.payload.ds === DataSource.Any) {
    searchRequest = { apiKey: GOV_API_KEY, q: action.payload.searchString };
  } else {
    const ds = action.payload.ds === DataSource.BL ? SearchDsEnum.BrandedFoodProducts : SearchDsEnum.StandardReference;
    searchRequest = { apiKey: GOV_API_KEY, q: action.payload.searchString, ds };
  }
  const usdaSearchFunc = (
    searchReq: { apiKey: string, q: string, ds?: SearchDsEnum }
  ) => (new UsdaClient()).search(searchReq);
  try {
    const usdaSearchResults: SearchResponse = yield call(usdaSearchFunc, searchRequest);
    yield put(actions.usdaFoodSearchSucceeded(usdaSearchResults.list.item));
  } catch (response) {
    console.log(response.message);
    /* TODO ...usda doesn't 400 actually, just a search that _says_ 400
    unfortunately, it looks like ATM the client generator doesn't handle oneOf
    How to handle the error response? */
    yield put(actions.usdaFoodSearchFailed());
  }
}

export function* searchMacroMacroForFood(action: ActionsTypeMap['foodSearchSubmit']) {
  try {
    const fn = () => macroMacro().searchByName({ q: action.payload.searchString });
    const macroMacroSearchResults: InlineResponse200 = yield call(fn);
    yield put(actions.macroMacroFoodSearchSucceeded(macroMacroSearchResults));
  } catch (response) {
    console.log(response.message);
    /* TODO ...usda doesn't 400 actually, just a search that _says_ 400
       unfortunately, it looks like ATM the client generator doesn't handle oneoF
       How to handle the error response? */
    yield put(actions.macroMacroFoodSearchFailed());
  }
}

function* copyRecipe(action: ActionsTypeMap['copyRecipe']) {
  const fn = () => macroMacro().findRecipeByUID({ uid: action.payload });
  const recipe: Recipe = yield call(fn);
  yield put(actions.addFoodsToRecipe(recipe));
}

function namedMacroToIngredient(nm: AmountOfNamedMacros) {
  return { uid: nm.namedMacros.uid, amount: nm.amount };
}

export function* saveRecipe(action: ActionsTypeMap['saveRecipe']) {
  try {
    const fn = () => macroMacro().createRecipe({
      newRecipe: {
        name: action.payload.name,
        foods: action.payload.foods.map(namedMacroToIngredient),
        portionSize: action.payload.portionSize,
        amount: action.payload.amount,
        unit: action.payload.unit
    }});
    const recipe = yield call(fn);
    yield put(actions.createRecipeSucceeded(recipe));
  } catch (response) {
    console.log(response.message);
  }
}

function* saveSearchItem(action: ActionsTypeMap['saveSearchItem']) {
  try {
    // little hack
    const uid = `ndbno::v1::${action.payload}`;
    const fn = () => macroMacro().findIngredientByUID({uid: uid});
    const namedMacros = yield call(fn);
    yield put(actions.saveSearchItemSucceeded(namedMacros));
  } catch (response) {
    console.log(response.message);
    yield put({ type: SAVE_SEARCH_ITEM_FAILED, payload: response.message });
  }
}

/* function* taker<T extends string, V>(f: (ActionWithPayload<T, V>) => ) {
  const z: string = CREATE_INGREDIENT_SUBMIT;
  yield takeLatest(CREATE_INGREDIENT_SUBMIT, f);
} */

export default function* rootSaga() {
  yield all([
    takeLeading(LOAD_INGREDIENTS_SUBMIT, loadInitialIngredientsAndRecipes),
    takeLeading(FOODSEARCH_SUBMIT, searchMacroMacroForFood),
    takeLeading(FOODSEARCH_SUBMIT, searchUsdaForFood),
    takeLeading(CREATE_INGREDIENT_SUBMIT, createIngredient),
    takeLeading(COPY_RECIPE, copyRecipe),
    takeLeading(CREATE_RECIPE_SUBMIT, saveRecipe),
    takeLeading(SAVE_SEARCH_ITEM, saveSearchItem)
  ]);
}
