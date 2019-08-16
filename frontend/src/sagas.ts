import { all, call, put, takeLatest, take } from 'redux-saga/effects';
import { DefaultApiFp as MacroMacroFp, NamedMacros, Recipe, AmountOfNamedMacros } from './client';
import { DefaultApi as UsdaClient, SearchResponse } from './usdaclient';
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
  LOAD_RECIPES_SUBMIT,
  LOAD_INGREDIENTS_SUCCESS,
  LOAD_RECIPES_SUCCESS
} from './constants';
import { GOV_API_KEY } from './apikey';

// TODO How am I supposed to test sagas without exporting them all?
// attempts to test the root saga have failed so far

export function* loadInitialIngredients() {
  try {
    const macros: NamedMacros[] = yield call(MacroMacroFp().findIngredients());
    yield put({ type: LOAD_INGREDIENTS_SUCCESS, payload: macros });
  } catch (response) {
    console.log(`error loading ingredients: ${response.message}`);
    yield put({ type: LOAD_INGREDIENTS_FAILED, payload: response.message });
  }
}

export function* loadInitialRecipes() {
  try {
    const macros: NamedMacros[] = yield call(MacroMacroFp().findRecipes());
    yield put({ type: LOAD_RECIPES_SUCCESS, payload: macros });
  } catch (response) {
    console.log(`error loading recipes: ${response.message}`);
    yield put({ type: LOAD_RECIPES_FAILED, payload: response.message });
  }
}

function* createIngredient(action: ActionsTypeMap['createIngredientSubmit']) {
  try {
    const macros: NamedMacros = yield call(MacroMacroFp().createIngredient(action.payload));
    yield put(actions.createIngredientSucceeded(macros));
  } catch (response) {
    console.log(`error creating ingredient: ${response.message}`);
    yield put({ type: CREATE_INGREDIENT_FAILED, payload: response.message });
  }
}

function* searchFood(action: ActionsTypeMap['foodSearchSubmit']) {
  const searchFunc = (searchString: string) => (new UsdaClient()).search(
    {apiKey: GOV_API_KEY, q: searchString}
  );
  try {
    const searchResults: SearchResponse = yield call(searchFunc, action.payload.searchString);
    yield put(actions.foodSearchSucceeded(searchResults.list.item));
  } catch (response) {
    console.log(`error searching '${action.payload.searchString}': ${response.message}`);
    yield put({ type: FOODSEARCH_FAILED, payload: response.message });
  }
}

function* copyRecipe(action: ActionsTypeMap['copyRecipe']) {
  const recipe: Recipe = yield call(MacroMacroFp().findRecipeByUID(action.payload));
  yield actions.addFoodsToRecipe(recipe);
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

/* function* taker<T extends string, V>(f: (ActionWithPayload<T, V>) => ) {
  const z: string = CREATE_INGREDIENT_SUBMIT;
  yield takeLatest(CREATE_INGREDIENT_SUBMIT, f);
} */

export default function* rootSaga() {
  yield all([
    takeLatest(LOAD_INGREDIENTS_SUBMIT, loadInitialIngredients),
    takeLatest(LOAD_RECIPES_SUBMIT, loadInitialRecipes),
    takeLatest(FOODSEARCH_SUBMIT, searchFood),
    takeLatest(CREATE_INGREDIENT_SUBMIT, createIngredient),
    takeLatest(COPY_RECIPE, copyRecipe),
    takeLatest(CREATE_RECIPE_SUBMIT, saveRecipe)
  ]);
}
