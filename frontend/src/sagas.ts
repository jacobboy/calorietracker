import { call, put, takeLatest } from 'redux-saga/effects';
import { DefaultApiFp, NamedMacros } from './client';
import { ActionsTypeMap, actions } from './actions';
import {
  CREATE_INGREDIENT_FAILED,
  CREATE_INGREDIENT_SUBMIT,
} from './constants';

// worker Saga: will be fired on USER_FETCH_REQUESTED actions
function* createIngredient(action: ActionsTypeMap['createIngredientSubmit']) {
  try {
    const macros: NamedMacros = yield call(DefaultApiFp().createIngredient, action.payload);
    yield put(actions.createIngredientSucceeded(macros));
  } catch (response) {
    console.log('error creating ingredient');
    yield put({ type: CREATE_INGREDIENT_FAILED, message: e.message });
  }
}

/* function* taker<T extends string, V>(f: (ActionWithPayload<T, V>) => ) {
  const z: string = CREATE_INGREDIENT_SUBMIT;
  yield takeLatest(CREATE_INGREDIENT_SUBMIT, f);
} */

function* mySaga() {
  yield takeLatest(CREATE_INGREDIENT_SUBMIT, createIngredient);
}

export default mySaga;
