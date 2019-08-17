import { DefaultApiFp as MacroMacroFp } from './client';
import rootSaga, { loadInitialIngredients, loadInitialRecipes } from './sagas';
import {
  LOAD_INGREDIENTS_SUBMIT,
  LOAD_INGREDIENTS_SUCCESS,
  LOAD_INGREDIENTS_FAILED,
  LOAD_RECIPES_SUCCESS,
  LOAD_RECIPES_FAILED
} from './constants';
import { call, put } from 'redux-saga/effects';
import { cloneableGenerator } from '@redux-saga/testing-utils';

describe('The load ingredients saga', () => {
  const gen = cloneableGenerator(loadInitialIngredients)();
  gen.next();
/*   it('calls MacroMacroFp.findIngredients', () => {
    // TODO how am i supposed to assert this?
    expect(gen.next().value).toEqual(call(MacroMacroFp().findIngredients()));
  }); */
  it('puts a LOAD_INGREDIENT_SUCCESS on success', () => {
    expect(gen.clone().next([]).value).toEqual(put({ type: LOAD_INGREDIENTS_SUCCESS, payload: [] }));
  });

  it('puts a LOAD_INGREDIENT_FAILED on failure', () => {
    const clone = gen.clone();
    if (clone.throw) {
      expect(clone.throw({message: 'sup'}).value).toEqual(put({ type: LOAD_INGREDIENTS_FAILED, payload: 'sup' }));
    } else {
      throw('clone not throwable');
    }
  });
});

describe('The load recipes saga', () => {
  const gen = cloneableGenerator(loadInitialRecipes)();
  gen.next();
/*   it('calls MacroMacroFp.findIngredients', () => {
    // TODO how am i supposed to assert this?
    expect(gen.next().value).toEqual(call(MacroMacroFp().findIngredients()));
  }); */
  it('puts a LOAD_RECIPES_SUCCESS on success', () => {
    expect(gen.clone().next([]).value).toEqual(put({ type: LOAD_RECIPES_SUCCESS, payload: [] }));
  });

  it('puts a LOAD_RECIPES_FAILED on failure', () => {
    const clone = gen.clone();
    if (clone.throw) {
      expect(clone.throw({message: 'sup'}).value).toEqual(put({ type: LOAD_RECIPES_FAILED, payload: 'sup' }));
    } else {
      throw('clone not throwable');
    }

  });
});