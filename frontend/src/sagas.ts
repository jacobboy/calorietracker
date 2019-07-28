import { call, put, takeLatest } from 'redux-saga/effects';
import { DefaultApiFp, NamedMacros, Recipe, AmountOfNamedMacros } from './client';
import { ActionsTypeMap, actions } from './actions';
import {
  CREATE_INGREDIENT_FAILED,
  CREATE_INGREDIENT_SUBMIT,
  FOODSEARCH_SUBMIT,
  FOODSEARCH_FAILED,
  COPY_RECIPE,
  CREATE_RECIPE_SUBMIT
} from './constants';

function* createIngredient(action: ActionsTypeMap['createIngredientSubmit']) {
  try {
    const macros: NamedMacros = yield call(DefaultApiFp().createIngredient, action.payload);
    yield put(actions.createIngredientSucceeded(macros));
  } catch (response) {
    console.log('error creating ingredient');
    yield put({ type: CREATE_INGREDIENT_FAILED, message: response.message });
  }
}

function* searchFood(action: ActionsTypeMap['foodSearchSubmit']) {
  try {
    const searchResults: NamedMacros[] = yield call(DefaultApiFp().searchByName, action.payload.searchString);
    yield put(actions.foodSearchSucceeded(searchResults));
  } catch (response) {
    console.log('error creating ingredient');
    yield put({ type: FOODSEARCH_FAILED, message: response.message });
  }
}

function* copyRecipe(action: ActionsTypeMap['copyRecipe']) {
  const recipe: Recipe = yield call(DefaultApiFp().findRecipeByUID, action.payload);
  yield actions.addFoodsToRecipe(recipe);
}

function namedMacroToIngredient(nm: AmountOfNamedMacros) {
  return {uid: nm.namedMacros.uid, amount: nm.amount};
}

function* saveRecipe(action: ActionsTypeMap['saveRecipe']) {
  const recipe = yield call(
    DefaultApiFp().createRecipe, {
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
