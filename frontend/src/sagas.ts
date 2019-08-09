import { call, put, takeLatest } from 'redux-saga/effects';
import { DefaultApiFp as MacroMacroFp, NamedMacros, Recipe, AmountOfNamedMacros } from './client';
import { DefaultApi as UsdaClient, SearchResponse } from './usdaclient';
import { ActionsTypeMap, actions } from './actions';
import {
  CREATE_INGREDIENT_FAILED,
  CREATE_INGREDIENT_SUBMIT,
  FOODSEARCH_SUBMIT,
  FOODSEARCH_FAILED,
  COPY_RECIPE,
  CREATE_RECIPE_SUBMIT
} from './constants';
import { GOV_API_KEY } from './apikey';

function* createIngredient(action: ActionsTypeMap['createIngredientSubmit']) {
  try {
    const macros: NamedMacros = yield call(MacroMacroFp().createIngredient, action.payload);
    yield put(actions.createIngredientSucceeded(macros));
  } catch (response) {
    console.log('error creating ingredient');
    yield put({ type: CREATE_INGREDIENT_FAILED, message: response.message });
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
    console.log('error creating ingredient');
    yield put({ type: FOODSEARCH_FAILED, message: response.message });
  }
}

function* copyRecipe(action: ActionsTypeMap['copyRecipe']) {
  const recipe: Recipe = yield call(MacroMacroFp().findRecipeByUID, action.payload);
  yield actions.addFoodsToRecipe(recipe);
}

function namedMacroToIngredient(nm: AmountOfNamedMacros) {
  return {uid: nm.namedMacros.uid, amount: nm.amount};
}

function* saveRecipe(action: ActionsTypeMap['saveRecipe']) {
  const recipe = yield call(
    MacroMacroFp().createRecipe, {
      name: action.payload.name,
      foods: action.payload.foods.map(namedMacroToIngredient),
      portionSize: action.payload.portionSize,
      totalSize: action.payload.totalSize,
      unit: action.payload.unit
    }
  );
  yield actions.createRecipeSucceeded(recipe);
}

/* function* taker<T extends string, V>(f: (ActionWithPayload<T, V>) => ) {
  const z: string = CREATE_INGREDIENT_SUBMIT;
  yield takeLatest(CREATE_INGREDIENT_SUBMIT, f);
} */

function* mySaga() {
  yield takeLatest(CREATE_INGREDIENT_SUBMIT, createIngredient);
  yield takeLatest(FOODSEARCH_SUBMIT, searchFood);
  yield takeLatest(COPY_RECIPE, copyRecipe);
  yield takeLatest(CREATE_RECIPE_SUBMIT, saveRecipe);
}

export default mySaga;
