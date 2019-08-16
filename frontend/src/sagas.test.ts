import { DefaultApiFp as MacroMacroFp } from './client';
import rootSaga, { loadInitialIngredients } from './sagas';
import { LOAD_INGREDIENTS_SUBMIT, LOAD_INGREDIENTS_SUCCESS, LOAD_INGREDIENTS_FAILED } from './constants';
import { call, put } from 'redux-saga/effects';
import { cloneableGenerator } from '@redux-saga/testing-utils';

describe('The load ingredients saga', () => {
  const gen = cloneableGenerator(loadInitialIngredients)();
  it('calls MacroMacroFp.findIngredients', () => {
    // TODO how am i supposed to assert this?
    expect(gen.next().value).toEqual(call(MacroMacroFp().findIngredients()));
  });
  it('puts a LOAD_INGREDIENT_SUCCESS on success', () => {
    expect(gen.clone().next([]).value).toEqual(put({ type: LOAD_INGREDIENTS_SUCCESS, payload: [] }));
  });

  it('puts a LOAD_INGREDIENT_FAILED on failure', () => {
    const iterator = loadInitialIngredients();
    iterator.next();
    expect(iterator.throw({message: 'sup'}).value).toEqual(put({ type: LOAD_INGREDIENTS_FAILED, payload: 'sup' }));
  });

});